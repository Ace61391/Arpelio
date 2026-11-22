-- Online quizzes: teachers, the quizzes they share, and what students submit.
--
-- Access model
--   The Next.js server is the only client of these tables. It works out who the teacher is from their
--   Supabase Auth session, then calls the functions below with the service-role key.
--   Row level security is ON with NO policies, and the functions cannot be executed by the `anon` or
--   `authenticated` roles. So nothing here is reachable through Supabase's public Data API, even with
--   the publishable key that ships to the browser.
--
-- Every function returns jsonb, so the server gets the same shape from Supabase and from the local
-- test database (dev/local-db.mjs).

-- ---------------------------------------------------------------------------------------------
-- Plans: per-teacher limits. A paid tier is a new row here plus a change to teachers.plan.
-- ---------------------------------------------------------------------------------------------
create table public.plans (
  id text primary key,
  max_quizzes int not null check (max_quizzes > 0),
  max_attempts_per_quiz int not null check (max_attempts_per_quiz > 0)
);

insert into public.plans (id, max_quizzes, max_attempts_per_quiz) values ('free', 30, 200);

-- ---------------------------------------------------------------------------------------------
-- Teachers: one row per signed-in teacher, keyed to Supabase Auth.
-- ---------------------------------------------------------------------------------------------
create table public.teachers (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  plan text not null default 'free' references public.plans (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------------------------
-- Quizzes: an instrument, a quiz type and an ordered list of notes, shared by a short code.
-- ---------------------------------------------------------------------------------------------
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  code text not null unique check (code ~ '^[a-z0-9]{6,16}$'),
  title text not null check (char_length(title) between 1 and 120),
  instrument text not null check (char_length(instrument) between 1 and 40),
  mode text not null check (mode in ('identify', 'fill')),
  notes text[] not null check (cardinality(notes) between 1 and 60),
  settings jsonb not null default '{}'::jsonb,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create index quizzes_teacher_idx on public.quizzes (teacher_id, created_at desc);

-- ---------------------------------------------------------------------------------------------
-- Attempts: one row per submission. Students have no accounts; a name is all that is stored.
-- answers = [{ "q": "C4", "label": "C4", "given": "G", "correct": false }, ...]  (q = question id)
-- ---------------------------------------------------------------------------------------------
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  student_name text not null check (char_length(student_name) between 1 and 60),
  score int not null check (score >= 0),
  total int not null check (total > 0),
  answers jsonb not null check (jsonb_typeof(answers) = 'array'),
  started_at timestamptz,
  submitted_at timestamptz not null default now(),
  check (score <= total)
);

create index attempts_quiz_idx on public.attempts (quiz_id, submitted_at desc);

alter table public.plans enable row level security;
alter table public.teachers enable row level security;
alter table public.quizzes enable row level security;
alter table public.attempts enable row level security;

revoke all on public.plans, public.teachers, public.quizzes, public.attempts from anon, authenticated;

-- The server (secret key = service_role) is the only caller. Newer Supabase projects no longer grant
-- table access to the API roles automatically, so say it out loud here.
grant usage on schema public to service_role;
grant select, insert, update, delete on public.plans, public.teachers, public.quizzes, public.attempts to service_role;

-- ---------------------------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------------------------

-- Make sure a signed-in user has a teacher row. Called at sign-in.
create function public.teacher_ensure(p_id uuid, p_email text)
returns jsonb language plpgsql set search_path = public as $$
declare v_row public.teachers;
begin
  insert into public.teachers (id, email) values (p_id, p_email)
  on conflict (id) do update set email = excluded.email
  returning * into v_row;
  return to_jsonb(v_row);
end $$;

-- The teacher's plan, its limits and how much of them is used.
create function public.teacher_summary(p_teacher uuid)
returns jsonb language sql stable set search_path = public as $$
  select jsonb_build_object(
    'email', t.email,
    'plan', t.plan,
    'max_quizzes', pl.max_quizzes,
    'max_attempts_per_quiz', pl.max_attempts_per_quiz,
    'quizzes', (select count(*) from public.quizzes q where q.teacher_id = t.id)
  )
  from public.teachers t join public.plans pl on pl.id = t.plan
  where t.id = p_teacher;
$$;

-- Create a quiz. The share code is generated by the server; a clash returns code_taken so it can retry.
create function public.quiz_create(
  p_teacher uuid, p_code text, p_title text, p_instrument text, p_mode text, p_notes text[], p_settings jsonb
) returns jsonb language plpgsql set search_path = public as $$
declare
  v_limit int;
  v_count int;
  v_row public.quizzes;
begin
  select pl.max_quizzes into v_limit
  from public.teachers t join public.plans pl on pl.id = t.plan
  where t.id = p_teacher;
  if v_limit is null then
    return jsonb_build_object('ok', false, 'error', 'no_teacher');
  end if;

  select count(*) into v_count from public.quizzes where teacher_id = p_teacher;
  if v_count >= v_limit then
    return jsonb_build_object('ok', false, 'error', 'quiz_limit', 'limit', v_limit);
  end if;

  begin
    insert into public.quizzes (teacher_id, code, title, instrument, mode, notes, settings)
    values (p_teacher, p_code, p_title, p_instrument, p_mode, p_notes, coalesce(p_settings, '{}'::jsonb))
    returning * into v_row;
  exception when unique_violation then
    return jsonb_build_object('ok', false, 'error', 'code_taken');
  end;

  return jsonb_build_object('ok', true, 'quiz', to_jsonb(v_row));
end $$;

-- What a student's browser may know about a quiz: no teacher details, no results.
create function public.quiz_public(p_code text)
returns jsonb language sql stable set search_path = public as $$
  select jsonb_build_object(
    'code', q.code, 'title', q.title, 'instrument', q.instrument, 'mode', q.mode,
    'notes', to_jsonb(q.notes), 'settings', q.settings, 'status', q.status
  )
  from public.quizzes q where q.code = p_code;
$$;

-- Store a graded submission. The server grades; this checks the quiz is open and under its limit.
create function public.attempt_submit(
  p_code text, p_student text, p_score int, p_total int, p_answers jsonb, p_started timestamptz
) returns jsonb language plpgsql set search_path = public as $$
declare
  v_quiz public.quizzes;
  v_limit int;
  v_count int;
  v_id uuid;
begin
  select * into v_quiz from public.quizzes where code = p_code;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_quiz.status <> 'open' then
    return jsonb_build_object('ok', false, 'error', 'closed');
  end if;

  select pl.max_attempts_per_quiz into v_limit
  from public.teachers t join public.plans pl on pl.id = t.plan
  where t.id = v_quiz.teacher_id;
  select count(*) into v_count from public.attempts where quiz_id = v_quiz.id;
  if v_count >= v_limit then
    return jsonb_build_object('ok', false, 'error', 'quiz_full', 'limit', v_limit);
  end if;

  insert into public.attempts (quiz_id, student_name, score, total, answers, started_at)
  values (v_quiz.id, p_student, p_score, p_total, p_answers, p_started)
  returning id into v_id;

  return jsonb_build_object('ok', true, 'attempt_id', v_id);
end $$;

-- The dashboard list: each quiz with its submission count and class average.
create function public.quiz_list(p_teacher uuid)
returns jsonb language sql stable set search_path = public as $$
  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
  from (
    select q.id, q.code, q.title, q.instrument, q.mode, q.status, q.created_at,
           cardinality(q.notes) as questions,
           count(a.id) as attempts,
           round(avg(a.score::numeric / a.total) * 100) as average_percent,
           max(a.submitted_at) as last_submitted_at
    from public.quizzes q
    left join public.attempts a on a.quiz_id = q.id
    where q.teacher_id = p_teacher
    group by q.id
  ) x;
$$;

-- One quiz for its owner: the quiz, every submission, and per-question statistics.
-- Returns null when the quiz does not exist or belongs to another teacher.
create function public.quiz_detail(p_teacher uuid, p_quiz uuid)
returns jsonb language plpgsql stable set search_path = public as $$
declare v_quiz public.quizzes;
begin
  select * into v_quiz from public.quizzes where id = p_quiz and teacher_id = p_teacher;
  if not found then
    return null;
  end if;

  return (
    with ans as (
      select e.value ->> 'q' as q,
             max(e.value ->> 'label') over (partition by e.value ->> 'q') as label,
             coalesce((e.value ->> 'correct')::boolean, false) as correct,
             e.value ->> 'given' as given
      from public.attempts a, lateral jsonb_array_elements(a.answers) e
      where a.quiz_id = v_quiz.id
    ),
    per_note as (
      select q, max(label) as label, count(*) as answered, count(*) filter (where not correct) as wrong
      from ans group by q
    ),
    wrong as (
      select q, given, count(*) as n,
             row_number() over (partition by q order by count(*) desc, given) as rank
      from ans
      where not correct and given is not null and given <> ''
      group by q, given
    )
    select jsonb_build_object(
      'quiz', to_jsonb(v_quiz),
      'attempts', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'id', a.id, 'student_name', a.student_name, 'score', a.score, 'total', a.total,
                 'started_at', a.started_at, 'submitted_at', a.submitted_at, 'answers', a.answers)
               order by a.submitted_at desc)
        from public.attempts a where a.quiz_id = v_quiz.id), '[]'::jsonb),
      'questions', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'question', p.q, 'label', p.label, 'answered', p.answered, 'wrong', p.wrong,
                 'common_wrong', coalesce((
                   select jsonb_agg(jsonb_build_object('given', w.given, 'count', w.n) order by w.rank)
                   from wrong w where w.q = p.q and w.rank <= 3), '[]'::jsonb))
               order by p.wrong desc, p.q)
        from per_note p), '[]'::jsonb)
    )
  );
end $$;

-- Open or close a quiz to new submissions.
create function public.quiz_set_status(p_teacher uuid, p_quiz uuid, p_status text)
returns jsonb language plpgsql set search_path = public as $$
declare v_n int;
begin
  if p_status not in ('open', 'closed') then
    return jsonb_build_object('ok', false, 'error', 'bad_status');
  end if;
  update public.quizzes set status = p_status where id = p_quiz and teacher_id = p_teacher;
  get diagnostics v_n = row_count;
  return jsonb_build_object('ok', v_n = 1);
end $$;

-- Delete a quiz and, through the foreign key, every submission to it.
create function public.quiz_delete(p_teacher uuid, p_quiz uuid)
returns jsonb language plpgsql set search_path = public as $$
declare v_n int;
begin
  delete from public.quizzes where id = p_quiz and teacher_id = p_teacher;
  get diagnostics v_n = row_count;
  return jsonb_build_object('ok', v_n = 1);
end $$;

-- Delete one student's submission.
create function public.attempt_delete(p_teacher uuid, p_attempt uuid)
returns jsonb language plpgsql set search_path = public as $$
declare v_n int;
begin
  delete from public.attempts a
  using public.quizzes q
  where a.id = p_attempt and q.id = a.quiz_id and q.teacher_id = p_teacher;
  get diagnostics v_n = row_count;
  return jsonb_build_object('ok', v_n = 1);
end $$;

-- Only the server's service role may run these.
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('teacher_ensure', 'teacher_summary', 'quiz_create', 'quiz_public', 'attempt_submit',
                        'quiz_list', 'quiz_detail', 'quiz_set_status', 'quiz_delete', 'attempt_delete')
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;

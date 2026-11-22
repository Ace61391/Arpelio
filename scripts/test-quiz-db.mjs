#!/usr/bin/env node
// Tests the online-quiz database: runs the real migration on a local Postgres (PGlite) and exercises every
// function, the limits, ownership, and the lock-down of the public roles. Run: node scripts/test-quiz-db.mjs
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLocalDb } from '../dev/local-db.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const db = await createLocalDb(ROOT);
let checks = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); checks++; };
const eq = (a, b, msg) => { assert.deepEqual(a, b, msg); checks++; };

const ada = await db.devUser('ada@school.test');
const ben = await db.devUser('ben@school.test');
await db.rpc('teacher_ensure', { p_id: ada.id, p_email: ada.email });
await db.rpc('teacher_ensure', { p_id: ben.id, p_email: ben.email });

// --- create
const made = await db.rpc('quiz_create', {
  p_teacher: ada.id, p_code: 'abc234', p_title: 'Week 7 trumpet', p_instrument: 'bb-trumpet', p_mode: 'identify',
  p_notes: ['C4', 'D4', 'E4'], p_settings: { shuffle: true },
});
ok(made.ok, 'quiz is created');
eq(made.quiz.notes, ['C4', 'D4', 'E4'], 'notes keep their order');
const quizId = made.quiz.id;

const clash = await db.rpc('quiz_create', { p_teacher: ben.id, p_code: 'abc234', p_title: 'x', p_instrument: 'flute', p_mode: 'fill', p_notes: ['D4'], p_settings: {} });
eq(clash, { ok: false, error: 'code_taken' }, 'a duplicate share code is reported, not thrown');

const stranger = await db.devUser('nobody@school.test');
eq((await db.rpc('quiz_create', { p_teacher: stranger.id, p_code: 'zzz999', p_title: 'x', p_instrument: 'flute', p_mode: 'fill', p_notes: ['D4'], p_settings: {} })).error, 'no_teacher', 'a user with no teacher row cannot create');

await assert.rejects(db.rpc('quiz_create', { p_teacher: ada.id, p_code: 'bad code!', p_title: 'x', p_instrument: 'flute', p_mode: 'fill', p_notes: ['D4'], p_settings: {} }), 'a malformed code is rejected by the table');
checks++;
await assert.rejects(db.rpc('quiz_create', { p_teacher: ada.id, p_code: 'mode12', p_title: 'x', p_instrument: 'flute', p_mode: 'reference', p_notes: ['D4'], p_settings: {} }), 'only identify and fill are quiz types');
checks++;

// --- public view
const pub = await db.rpc('quiz_public', { p_code: 'abc234' });
eq(Object.keys(pub).sort(), ['code', 'instrument', 'mode', 'notes', 'settings', 'status', 'title'], 'the public view carries no teacher id and no results');
eq(await db.rpc('quiz_public', { p_code: 'nope99' }), null, 'an unknown code is null');

// --- submit
const answers = (given) => [
  { q: 'C4', label: 'C4', given: given[0], correct: given[0] === 'C' },
  { q: 'D4', label: 'D4', given: given[1], correct: given[1] === 'D' },
  { q: 'E4', label: 'E4', given: given[2], correct: given[2] === 'E' },
];
const submit = (name, given) => {
  const a = answers(given);
  return db.rpc('attempt_submit', { p_code: 'abc234', p_student: name, p_score: a.filter((x) => x.correct).length, p_total: 3, p_answers: a, p_started: new Date().toISOString() });
};
ok((await submit('Mia K', ['C', 'D', 'E'])).ok, 'a submission is stored');
await submit('Leo P', ['C', 'G', 'A']);
await submit('Zoe T', ['C', 'G', 'E']);
eq((await db.rpc('attempt_submit', { p_code: 'nope99', p_student: 'x', p_score: 0, p_total: 1, p_answers: [], p_started: null })).error, 'not_found', 'submitting to an unknown quiz fails cleanly');
await assert.rejects(db.rpc('attempt_submit', { p_code: 'abc234', p_student: 'x', p_score: 5, p_total: 3, p_answers: [], p_started: null }), 'a score above the total is rejected');
checks++;

// --- list
const list = await db.rpc('quiz_list', { p_teacher: ada.id });
eq(list.length, 1, 'the teacher sees their quiz');
eq([Number(list[0].attempts), Number(list[0].average_percent), list[0].questions], [3, 67, 3], 'count and class average: (3 + 1 + 2) / 9 = 67%');
eq(await db.rpc('quiz_list', { p_teacher: ben.id }), [], 'another teacher sees nothing');

// --- detail and analytics
const detail = await db.rpc('quiz_detail', { p_teacher: ada.id, p_quiz: quizId });
eq(detail.attempts.map((a) => a.student_name).sort(), ['Leo P', 'Mia K', 'Zoe T'], 'every submission is listed');
const stats = Object.fromEntries(detail.questions.map((q) => [q.question, q]));
eq([Number(stats.C4.wrong), Number(stats.D4.wrong), Number(stats.E4.wrong)], [0, 2, 1], 'wrong answers are counted per note');
eq([detail.questions[0].question, detail.questions[0].label], ['D4', 'D4'], 'the most-missed question comes first, with its label');
eq(stats.D4.common_wrong.map((w) => [w.given, Number(w.count)]), [['G', 2]], 'the most common wrong answer is reported');
eq(await db.rpc('quiz_detail', { p_teacher: ben.id, p_quiz: quizId }), null, "another teacher cannot open someone else's quiz");

// --- close / reopen
eq(await db.rpc('quiz_set_status', { p_teacher: ben.id, p_quiz: quizId, p_status: 'closed' }), { ok: false }, 'another teacher cannot close it');
eq(await db.rpc('quiz_set_status', { p_teacher: ada.id, p_quiz: quizId, p_status: 'closed' }), { ok: true }, 'the owner can close it');
eq((await submit('Late L', ['C', 'D', 'E'])).error, 'closed', 'a closed quiz takes no submissions');
await db.rpc('quiz_set_status', { p_teacher: ada.id, p_quiz: quizId, p_status: 'open' });

// --- delete one submission
const leo = detail.attempts.find((a) => a.student_name === 'Leo P');
eq(await db.rpc('attempt_delete', { p_teacher: ben.id, p_attempt: leo.id }), { ok: false }, "another teacher cannot delete a student's submission");
eq(await db.rpc('attempt_delete', { p_teacher: ada.id, p_attempt: leo.id }), { ok: true }, 'the owner can');
eq((await db.rpc('quiz_detail', { p_teacher: ada.id, p_quiz: quizId })).attempts.length, 2, 'and it is gone');

// --- limits
await db.raw.exec("insert into public.plans (id, max_quizzes, max_attempts_per_quiz) values ('tiny', 2, 2); update public.teachers set plan = 'tiny' where email = 'ben@school.test';");
const mk = (code) => db.rpc('quiz_create', { p_teacher: ben.id, p_code: code, p_title: 'q', p_instrument: 'flute', p_mode: 'fill', p_notes: ['D4'], p_settings: {} });
ok((await mk('ben001')).ok && (await mk('ben002')).ok, 'quizzes up to the plan limit are allowed');
eq(await mk('ben003'), { ok: false, error: 'quiz_limit', limit: 2 }, 'one more is refused with the limit');
const sub = (n) => db.rpc('attempt_submit', { p_code: 'ben001', p_student: n, p_score: 1, p_total: 1, p_answers: [{ q: 'D4', label: 'D4', given: 'x', correct: true }], p_started: null });
await sub('a'); await sub('b');
eq(await sub('c'), { ok: false, error: 'quiz_full', limit: 2 }, 'submissions past the plan limit are refused');
const summary = await db.rpc('teacher_summary', { p_teacher: ben.id });
eq([summary.plan, summary.max_quizzes, Number(summary.quizzes)], ['tiny', 2, 2], 'the summary reports plan, limit and usage');

// --- delete a quiz cascades
eq(await db.rpc('quiz_delete', { p_teacher: ada.id, p_quiz: quizId }), { ok: true }, 'the owner can delete a quiz');
const left = await db.raw.query('select count(*)::int as n from public.attempts a join public.quizzes q on q.id = a.quiz_id where q.teacher_id = $1', [ada.id]);
eq(left.rows[0].n, 0, 'its submissions go with it');

// --- deleting the auth user removes everything of theirs
await db.raw.query('delete from auth.users where id = $1', [ben.id]);
const gone = await db.raw.query("select (select count(*) from public.teachers where id = $1)::int + (select count(*) from public.quizzes where teacher_id = $1)::int as n", [ben.id]);
eq(gone.rows[0].n, 0, 'deleting the account deletes the teacher, their quizzes and results');

// --- the public roles are locked out
for (const role of ['anon', 'authenticated']) {
  await db.raw.exec(`set role ${role}`);
  await assert.rejects(db.raw.query('select * from public.attempts'), `${role} cannot read attempts`);
  await assert.rejects(db.raw.query('select * from public.quizzes'), `${role} cannot read quizzes`);
  await assert.rejects(db.raw.query("select public.quiz_public('abc234')"), `${role} cannot call the functions`);
  await assert.rejects(db.raw.query("select public.attempt_submit('ben001', 'x', 1, 1, '[]'::jsonb, null)"), `${role} cannot submit directly`);
  await db.raw.exec('reset role');
  checks += 4;
}
// --- the server role works through the functions without owning anything
const who = await db.raw.transaction(async (tx) => { await tx.exec('set local role service_role'); return (await tx.query('select current_user as u')).rows[0].u; });
eq(who, 'service_role', 'calls run as service_role');
const grants = await db.raw.query("select count(*)::int as n from information_schema.role_table_grants where grantee = 'service_role' and table_schema = 'public' and privilege_type in ('SELECT','INSERT','UPDATE','DELETE')");
eq(grants.rows[0].n, 16, 'service_role has exactly select/insert/update/delete on the four tables');
const rls = await db.raw.query("select count(*)::int as n from pg_tables where schemaname = 'public' and tablename in ('plans','teachers','quizzes','attempts') and rowsecurity");
eq(rls.rows[0].n, 4, 'row level security is on for all four tables');

console.log(`Quiz database tests passed: ${checks} checks.`);

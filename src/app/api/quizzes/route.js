import { INSTRUMENTS } from '@/data/instruments';
import { getFingeringsForInstrument } from '@/data/loader';
import { validateQuiz } from '@/lib/quiz/engine.mjs';
import { getTeacher, quizzesEnabled, rpc, sameOrigin, newShareCode, json, guarded } from '@/lib/quiz/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Create an online quiz from the builder's selection.
async function postHandler(request) {
  if (!quizzesEnabled()) return json({ error: 'Online quizzes are not switched on.' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Bad origin.' }, 403);
  const teacher = await getTeacher();
  if (!teacher) return json({ error: 'Sign in to share a quiz online.' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Bad request.' }, 400); }
  const checked = validateQuiz(body, { instruments: INSTRUMENTS, fingeringsFor: getFingeringsForInstrument });
  if (!checked.ok) return json({ error: checked.error }, 400);
  const { title, instrument, mode, notes, settings } = checked.quiz;

  await rpc('teacher_ensure', { p_id: teacher.id, p_email: teacher.email });
  for (let attempt = 0; attempt < 5; attempt++) {
    const made = await rpc('quiz_create', {
      p_teacher: teacher.id, p_code: newShareCode(), p_title: title, p_instrument: instrument,
      p_mode: mode, p_notes: notes, p_settings: settings,
    });
    if (made.ok) return json({ ok: true, quiz: { id: made.quiz.id, code: made.quiz.code, title: made.quiz.title } }, 201);
    if (made.error === 'quiz_limit') {
      return json({ error: `Your plan allows ${made.limit} online quizzes. Delete one you no longer need to make room.` }, 409);
    }
    if (made.error !== 'code_taken') return json({ error: 'Could not create the quiz.' }, 500);
  }
  return json({ error: 'Could not create the quiz. Try again.' }, 500);
}

export const POST = guarded(postHandler);

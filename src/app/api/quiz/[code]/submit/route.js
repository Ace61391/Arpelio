import { getInstrument } from '@/data/instruments';
import { getFingeringsForInstrument } from '@/data/loader';
import { gradeQuiz, cleanSettings } from '@/lib/quiz/engine.mjs';
import { quizzesEnabled, rpc, isShareCode, json, guarded } from '@/lib/quiz/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY = 40_000; // bytes; a 60-question quiz is far smaller

// Grade a student's answers on the server, store the result, and send the grade back.
async function postHandler(request, { params }) {
  if (!quizzesEnabled() || !isShareCode(params.code)) return json({ error: 'not_found' }, 404);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: 'too_large' }, 413);
  let body;
  try { body = JSON.parse(raw); } catch { return json({ error: 'bad_request' }, 400); }

  const name = String(body?.name ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (!name) return json({ error: 'name_required', message: 'Enter your name.' }, 400);
  const answers = body?.answers && typeof body.answers === 'object' && !Array.isArray(body.answers) ? body.answers : {};
  const started = Number.isFinite(Date.parse(body?.started_at)) ? new Date(body.started_at).toISOString() : null;

  const quiz = await rpc('quiz_public', { p_code: params.code });
  const inst = quiz && getInstrument(quiz.instrument);
  if (!quiz || !inst) return json({ error: 'not_found' }, 404);
  if (quiz.status !== 'open') return json({ error: 'closed', message: 'This quiz is closed.' }, 409);

  const graded = gradeQuiz(getFingeringsForInstrument(inst.id), quiz, inst.family, answers);
  const saved = await rpc('attempt_submit', {
    p_code: params.code, p_student: name, p_score: graded.score, p_total: graded.total,
    p_answers: graded.stored, p_started: started,
  });
  if (!saved.ok) {
    const message = {
      closed: 'This quiz is closed.',
      quiz_full: 'This quiz has reached its limit of submissions. Tell your teacher.',
      not_found: 'This quiz no longer exists.',
    }[saved.error] || 'Could not save your answers.';
    return json({ error: saved.error, message }, saved.error === 'not_found' ? 404 : 409);
  }

  const show = cleanSettings(quiz.settings).show_answers;
  return json({
    ok: true,
    name,
    score: graded.score,
    total: graded.total,
    percent: Math.round((graded.score / graded.total) * 100),
    results: graded.results.map((r) => (show
      ? r
      : { q: r.q, label: r.label, given: r.given, correct: r.correct })),
  });
}

export const POST = guarded(postHandler);

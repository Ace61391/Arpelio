import { getInstrument } from '@/data/instruments';
import { getFingeringsForInstrument } from '@/data/loader';
import { buildQuestions, publicQuestions, cleanSettings } from '@/lib/quiz/engine.mjs';
import { quizzesEnabled, rpc, isShareCode, json, guarded } from '@/lib/quiz/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// What a student's browser needs to take a quiz. The answer key stays on the server.
async function getHandler(request, { params }) {
  if (!quizzesEnabled() || !isShareCode(params.code)) return json({ error: 'not_found' }, 404);
  const quiz = await rpc('quiz_public', { p_code: params.code });
  const inst = quiz && getInstrument(quiz.instrument);
  if (!quiz || !inst) return json({ error: 'not_found' }, 404);
  if (quiz.status !== 'open') return json({ status: 'closed', title: quiz.title });

  const settings = cleanSettings(quiz.settings);
  const questions = publicQuestions(buildQuestions(getFingeringsForInstrument(inst.id), quiz, inst.family));
  return json({
    status: 'open',
    code: quiz.code,
    title: quiz.title,
    mode: quiz.mode,
    instrument: { id: inst.id, name: inst.name, clef: inst.clef, family: inst.family },
    settings: { shuffle: settings.shuffle, show_answers: settings.show_answers },
    questions,
  });
}

export const GET = guarded(getHandler);

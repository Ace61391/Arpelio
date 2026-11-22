import { getTeacher, quizzesEnabled, rpc, sameOrigin, isUuid, json, guarded } from '@/lib/quiz/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function guard(request, params) {
  if (!quizzesEnabled()) return { fail: json({ error: 'Online quizzes are not switched on.' }, 503) };
  if (!sameOrigin(request)) return { fail: json({ error: 'Bad origin.' }, 403) };
  if (!isUuid(params.id)) return { fail: json({ error: 'Not found.' }, 404) };
  const teacher = await getTeacher();
  if (!teacher) return { fail: json({ error: 'Sign in first.' }, 401) };
  return { teacher };
}

// Open or close a quiz to new submissions.
async function patchHandler(request, { params }) {
  const { fail, teacher } = await guard(request, params);
  if (fail) return fail;
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Bad request.' }, 400); }
  if (!['open', 'closed'].includes(body?.status)) return json({ error: 'Bad status.' }, 400);
  const res = await rpc('quiz_set_status', { p_teacher: teacher.id, p_quiz: params.id, p_status: body.status });
  return res.ok ? json({ ok: true, status: body.status }) : json({ error: 'Not found.' }, 404);
}

// Delete a quiz and every submission to it.
async function deleteHandler(request, { params }) {
  const { fail, teacher } = await guard(request, params);
  if (fail) return fail;
  const res = await rpc('quiz_delete', { p_teacher: teacher.id, p_quiz: params.id });
  return res.ok ? json({ ok: true }) : json({ error: 'Not found.' }, 404);
}

export const PATCH = guarded(patchHandler);
export const DELETE = guarded(deleteHandler);

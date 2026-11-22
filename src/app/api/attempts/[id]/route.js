import { getTeacher, quizzesEnabled, rpc, sameOrigin, isUuid, json, guarded } from '@/lib/quiz/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Delete one student's submission.
async function deleteHandler(request, { params }) {
  if (!quizzesEnabled()) return json({ error: 'Online quizzes are not switched on.' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Bad origin.' }, 403);
  if (!isUuid(params.id)) return json({ error: 'Not found.' }, 404);
  const teacher = await getTeacher();
  if (!teacher) return json({ error: 'Sign in first.' }, 401);
  const res = await rpc('attempt_delete', { p_teacher: teacher.id, p_attempt: params.id });
  return res.ok ? json({ ok: true }) : json({ error: 'Not found.' }, 404);
}

export const DELETE = guarded(deleteHandler);

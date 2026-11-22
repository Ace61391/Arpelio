import { getTeacher, quizzesEnabled, isLocal, json, guarded } from '@/lib/quiz/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Who is signed in. The builder asks this before offering to create an online quiz.
async function getHandler() {
  if (!quizzesEnabled()) return json({ enabled: false, teacher: null });
  const teacher = await getTeacher();
  return json({ enabled: true, local: isLocal(), teacher: teacher ? { email: teacher.email } : null });
}

export const GET = guarded(getHandler);

import { notFound } from 'next/navigation';
import QuizRunner from '@/components/quiz/QuizRunner';
import { quizzesEnabled, isShareCode } from '@/lib/quiz/server';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Quiz',
  robots: { index: false, follow: false },
};

// The page a student opens from the teacher's link.
export default function QuizPage({ params }) {
  if (!quizzesEnabled() || !isShareCode(params.code)) notFound();
  return <QuizRunner code={params.code} />;
}

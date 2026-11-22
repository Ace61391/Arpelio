import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getInstrument } from '@/data/instruments';
import { ShareLink, QuizActions, Results } from '@/components/quiz/Dashboard';
import { quizzesEnabled, getTeacher, rpc, isUuid } from '@/lib/quiz/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Quiz results', robots: { index: false, follow: false } };

const TYPE = { identify: 'Identify the note', fill: 'Fill the chart' };

export default async function QuizResultsPage({ params }) {
  if (!quizzesEnabled() || !isUuid(params.id)) notFound();
  const teacher = await getTeacher();
  if (!teacher) redirect(`/login?next=/dashboard/quizzes/${params.id}`);

  const detail = await rpc('quiz_detail', { p_teacher: teacher.id, p_quiz: params.id });
  if (!detail) notFound();
  const { quiz, attempts, questions } = detail;
  const inst = getInstrument(quiz.instrument);

  return (
    <>
      <Nav />
      <main className="px-6 md:px-8 py-10 max-w-[1160px] mx-auto">
        <div className="text-sm text-[#6b7385] mb-5">
          <Link href="/dashboard" className="hover:text-accent">Your online quizzes</Link> <span>/</span> <span className="text-[#1a1d23] font-medium">{quiz.title}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight">{quiz.title}</h1>
              <span className={`text-[11px] font-bold uppercase tracking-wide rounded px-1.5 py-0.5 ${quiz.status === 'open' ? 'text-[#1f7d5d] bg-[#e6f9f0]' : 'text-[#6b7385] bg-[#f1f3f6]'}`} data-testid="quiz-status">{quiz.status}</span>
            </div>
            <p className="text-sm text-[#4a5060]">{inst?.name || quiz.instrument} · {TYPE[quiz.mode]} · {quiz.notes.length} {quiz.notes.length === 1 ? 'note' : 'notes'}</p>
          </div>
          <QuizActions quiz={{ id: quiz.id, title: quiz.title, status: quiz.status }} />
        </div>

        <div className="bg-white border border-[#e5e8ed] rounded-card p-4 mb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-[#6b7385] mb-1.5">Student link</div>
          <ShareLink code={quiz.code} />
          {quiz.status !== 'open' && <p className="text-sm text-[#b45309] mt-2">This quiz is closed. Students who open the link cannot submit until you reopen it.</p>}
        </div>

        <Results quiz={{ title: quiz.title, mode: quiz.mode }} attempts={attempts} questions={questions} instrumentId={quiz.instrument} />
      </main>
      <Footer />
    </>
  );
}

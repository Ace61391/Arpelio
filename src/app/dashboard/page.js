import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getInstrument } from '@/data/instruments';
import { ShareLink } from '@/components/quiz/Dashboard';
import { quizzesEnabled, getTeacher, rpc } from '@/lib/quiz/server';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your online quizzes', robots: { index: false, follow: false } };

const TYPE = { identify: 'Identify the note', fill: 'Fill the chart' };

export default async function DashboardPage() {
  if (!quizzesEnabled()) notFound();
  const teacher = await getTeacher();
  if (!teacher) redirect('/login?next=/dashboard');

  let summary = await rpc('teacher_summary', { p_teacher: teacher.id });
  if (!summary) {
    await rpc('teacher_ensure', { p_id: teacher.id, p_email: teacher.email });
    summary = await rpc('teacher_summary', { p_teacher: teacher.id });
  }
  const quizzes = await rpc('quiz_list', { p_teacher: teacher.id });

  return (
    <>
      <Nav />
      <main className="px-6 md:px-8 py-10 max-w-[1160px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-1">Your online quizzes</h1>
            <p className="text-sm text-[#4a5060]">
              Signed in as {teacher.email} · {summary.quizzes} of {summary.max_quizzes} quizzes used
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/builder?mode=identify" className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors">New quiz</Link>
            <form method="post" action="/auth/signout">
              <button type="submit" className="text-sm font-semibold px-4 py-2.5 rounded-lg border border-[#d0d4dc] text-[#4a5060] hover:border-accent">Sign out</button>
            </form>
          </div>
        </div>

        {quizzes.length === 0 ? (
          <div className="border border-dashed border-[#d0d4dc] rounded-2xl p-10 text-center bg-[#f8f9fb]">
            <p className="text-lg font-bold text-[#1a1d23] mb-1">No online quizzes yet</p>
            <p className="text-[#4a5060] mb-5">Build a quiz as usual, then choose “Share online” to get a link for your students.</p>
            <Link href="/builder?mode=identify" className="inline-block bg-accent hover:bg-accent-hover text-white text-sm font-bold px-5 py-2.5 rounded-lg">Build a quiz</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {quizzes.map((q) => (
              <div key={q.id} className="bg-white border border-[#e5e8ed] rounded-card p-5 flex flex-col lg:flex-row lg:items-center gap-4" data-testid="quiz-row">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/dashboard/quizzes/${q.id}`} className="text-lg font-bold text-[#1a1d23] hover:text-accent">{q.title}</Link>
                    <span className={`text-[11px] font-bold uppercase tracking-wide rounded px-1.5 py-0.5 ${q.status === 'open' ? 'text-[#1f7d5d] bg-[#e6f9f0]' : 'text-[#6b7385] bg-[#f1f3f6]'}`}>{q.status}</span>
                  </div>
                  <div className="text-sm text-[#4a5060] mt-0.5">
                    {getInstrument(q.instrument)?.name || q.instrument} · {TYPE[q.mode]} · {q.questions} {q.questions === 1 ? 'note' : 'notes'}
                  </div>
                  <div className="mt-2"><ShareLink code={q.code} /></div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-[#1a1d23]">{q.attempts}</div>
                    <div className="text-xs text-[#6b7385]">{Number(q.attempts) === 1 ? 'submission' : 'submissions'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-[#1a1d23]">{q.average_percent === null ? '–' : `${q.average_percent}%`}</div>
                    <div className="text-xs text-[#6b7385]">average</div>
                  </div>
                  <Link href={`/dashboard/quizzes/${q.id}`} className="text-sm font-bold text-accent hover:underline whitespace-nowrap">View results →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

'use client';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

// Shown when the dashboard cannot reach the database (for example while the Supabase project is paused).
export default function DashboardError({ reset }) {
  return (
    <>
      <Nav />
      <main className="px-6 md:px-8 py-20 max-w-[560px] mx-auto text-center">
        <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-3">Your quizzes did not load</h1>
        <p className="text-base text-[#4a5060] mb-8">
          Arpelio could not reach its quiz service. Nothing has been lost. Wait a moment and try again.
        </p>
        <button onClick={() => reset()} className="bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 text-base font-bold">
          Try again
        </button>
      </main>
      <Footer />
    </>
  );
}

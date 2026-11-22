'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShareLink } from './Dashboard';

// Step 5 of the builder: turn the current quiz into a link students can open and answer on any device.
export default function ShareOnline({ instrumentId, mode, notes, title, resume = false }) {
  const [me, setMe] = useState(null); // { enabled, teacher }
  const [shuffle, setShuffle] = useState(true);
  const [showAnswers, setShowAnswers] = useState(true);
  const [alternates, setAlternates] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [made, setMade] = useState(null);

  useEffect(() => {
    fetch('/api/me', { cache: 'no-store' }).then((r) => r.json()).then(setMe).catch(() => setMe({ enabled: false, teacher: null }));
  }, []);
  // a new selection means a new quiz: hide the old link
  useEffect(() => { setMade(null); setError(''); }, [instrumentId, mode, notes.join(',')]);

  if (me && !me.enabled) return null;
  const isQuiz = mode === 'identify' || mode === 'fill';

  // After signing in, come back to the builder with the same quiz set up.
  const loginHref = () => {
    const back = new URLSearchParams({ instrument: instrumentId, mode, notes: notes.join(','), online: '1' });
    if (title) back.set('title', title);
    return `/login?next=${encodeURIComponent(`/builder?${back.toString()}`)}`;
  };

  const create = async () => {
    setBusy(true); setError('');
    try {
      const r = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ instrument: instrumentId, mode, notes, title, settings: { shuffle, show_answers: showAnswers, accept_alternates: alternates } }),
      });
      const body = await r.json().catch(() => ({}));
      if (r.status === 401) { window.location.href = loginHref(); return; }
      if (!r.ok) setError(body.message || body.error || 'Could not create the quiz.'); else setMade(body.quiz);
    } catch { setError('Could not create the quiz. Check your connection.'); }
    setBusy(false);
  };

  const check = 'w-4 h-4 rounded border-[#d0d4dc] text-accent focus:ring-accent';

  return (
    <div className="mb-8" id="share-online">
      <h2 className="text-sm font-bold text-[#7a8294] uppercase tracking-widest mb-3">5. Share online</h2>
      <div className={`rounded-xl border p-4 ${resume && !made ? 'border-accent bg-accent-light' : 'border-[#e5e8ed] bg-white'}`}>
        {!isQuiz ? (
          <p className="text-sm text-[#4a5060]">Choose one of the two quiz types above to share it as an online quiz that grades itself.</p>
        ) : made ? (
          <div data-testid="share-made">
            <p className="text-sm font-bold text-[#1f7d5d] mb-2">Your quiz is live. Send students this link:</p>
            <ShareLink code={made.code} />
            <div className="mt-3"><Link href={`/dashboard/quizzes/${made.id}`} className="text-sm font-bold text-accent hover:underline">See results →</Link></div>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#4a5060] mb-3">
              Students open a link, type their name and answer one question at a time. It grades itself, and you see every score and the most-missed notes.
            </p>
            <div className="flex flex-col gap-2 mb-4">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className={check} checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} /><span className="text-sm text-[#4a5060]">Shuffle the question order for each student</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className={check} checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} /><span className="text-sm text-[#4a5060]">Show students the correct answers after they submit</span></label>
              {mode === 'fill' && (
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className={check} checked={alternates} onChange={(e) => setAlternates(e.target.checked)} /><span className="text-sm text-[#4a5060]">Accept alternate fingerings as correct</span></label>
              )}
            </div>
            {error && <p role="alert" className="text-sm font-semibold text-[#c0392b] mb-3">{error}</p>}
            {me?.teacher ? (
              <button onClick={create} disabled={busy || notes.length === 0}
                className="w-full bg-[#1a1d23] hover:bg-[#2a2d33] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-5 py-3 text-sm font-bold transition-colors">
                {busy ? 'Creating…' : `Create online quiz (${notes.length} ${notes.length === 1 ? 'note' : 'notes'})`}
              </button>
            ) : (
              <a href={me ? loginHref() : '#'} aria-disabled={!me || notes.length === 0}
                className={`block text-center w-full bg-[#1a1d23] hover:bg-[#2a2d33] text-white rounded-lg px-5 py-3 text-sm font-bold transition-colors ${!me || notes.length === 0 ? 'opacity-40 pointer-events-none' : ''}`}>
                Sign in to share online
              </a>
            )}
            {me?.teacher && <p className="text-xs text-[#6b7385] mt-2">Signed in as {me.teacher.email} · <Link href="/dashboard" className="text-accent font-semibold hover:underline">Your quizzes</Link></p>}
          </>
        )}
      </div>
    </div>
  );
}

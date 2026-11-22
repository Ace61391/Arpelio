'use client';
import { useState } from 'react';
import Link from 'next/link';
import { browserClient } from '@/lib/quiz/browser';
import { EMAIL_SIGNIN_ON } from '@/lib/quiz/flag';

const MESSAGES = {
  link: 'That sign-in link did not work. It may have expired or already been used. Ask for a new one below.',
  email: 'Enter a valid email address.',
};

export default function LoginForm({ next, local, error }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent
  const [problem, setProblem] = useState(MESSAGES[error] || '');

  // Where to return after sign-in travels in a short-lived cookie, not in the redirect URL. That keeps the URL
  // Supabase has to allow down to one fixed path, and it still works when the emailed link carries no extras.
  const callback = () => {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `arpelio_next=${encodeURIComponent(next)}; Path=/; Max-Age=3600; SameSite=Lax${secure}`;
    return `${window.location.origin}/auth/callback`;
  };

  const google = async () => {
    setProblem('');
    const { error: e } = await browserClient().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callback() } });
    if (e) setProblem('Could not start Google sign-in. Try the email link instead.');
  };

  const sendLink = async (e) => {
    e.preventDefault();
    setProblem(''); setState('sending');
    const { error: err } = await browserClient().auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: callback() } });
    if (err) { setProblem('Could not send the link. Check the address, or wait a minute and try again. Google sign-in above also works.'); setState('idle'); return; }
    setState('sent');
  };

  return (
    <div className="px-6 md:px-8 py-12 max-w-[440px] mx-auto">
      <h1 className="text-3xl font-extrabold text-[#1a1d23] tracking-tight mb-2">Teacher sign in</h1>
      <p className="text-base text-[#4a5060] mb-8">
        Sign in to share quizzes online and see your students&apos; results. Students never need an account.
      </p>

      {problem && <p role="alert" className="text-sm font-semibold text-[#c0392b] bg-[#fef0ef] border border-[#f1c4be] rounded-lg px-4 py-3 mb-5">{problem}</p>}

      {local ? (
        <form method="post" action="/auth/dev" className="border border-dashed border-[#d0d4dc] rounded-2xl p-6 bg-[#f8f9fb]">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6b7385] mb-3">Local stand-in sign-in</p>
          <input type="hidden" name="next" value={next} />
          <label htmlFor="dev-email" className="block text-sm font-semibold text-[#4a5060] mb-1.5">Email</label>
          <input id="dev-email" name="email" type="email" required defaultValue="teacher@example.test"
            className="w-full px-4 py-3 rounded-lg border border-[#d0d4dc] text-base focus:border-accent focus:outline-none mb-4 bg-white" />
          <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white rounded-lg px-6 py-3 text-base font-bold">Sign in</button>
        </form>
      ) : state === 'sent' ? (
        <div className="border border-[#bfe5d5] bg-[#e6f9f0] rounded-2xl p-6">
          <h2 className="text-lg font-bold text-[#1a1d23] mb-1">Check your email</h2>
          <p className="text-[#4a5060]">We sent a sign-in link to <span className="font-semibold">{email.trim()}</span>. Open it to finish signing in. It works once and expires after an hour.</p>
          <button onClick={() => setState('idle')} className="text-sm font-semibold text-accent hover:underline mt-4">Use a different address</button>
        </div>
      ) : (
        <>
          <button onClick={google}
            className="w-full border border-[#d0d4dc] hover:border-accent bg-white rounded-lg px-6 py-3 text-base font-semibold text-[#1a1d23] transition-colors">
            Continue with Google
          </button>

          {EMAIL_SIGNIN_ON && (
            <>
              <div className="flex items-center gap-3 my-6 text-xs font-semibold uppercase tracking-widest text-[#6b7385]">
                <span className="flex-1 h-px bg-[#e5e8ed]" />or<span className="flex-1 h-px bg-[#e5e8ed]" />
              </div>

              <form onSubmit={sendLink}>
                <label htmlFor="login-email" className="block text-sm font-semibold text-[#4a5060] mb-1.5">School or work email</label>
                <input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                  placeholder="you@school.org"
                  className="w-full px-4 py-3 rounded-lg border border-[#d0d4dc] text-base focus:border-accent focus:outline-none mb-4" />
                <button type="submit" disabled={state === 'sending' || !email.trim()}
                  className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-lg px-6 py-3 text-base font-bold transition-colors">
                  {state === 'sending' ? 'Sending…' : 'Email me a sign-in link'}
                </button>
                <p className="text-sm text-[#6b7385] mt-3">No password. The link signs you in.</p>
              </form>
            </>
          )}
        </>
      )}

      <p className="text-sm text-[#6b7385] mt-8">
        What Arpelio stores, and for how long, is on the <Link href="/privacy" className="text-accent font-semibold hover:underline">privacy page</Link>.
      </p>
    </div>
  );
}

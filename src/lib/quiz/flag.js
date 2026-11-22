// Whether online quizzes are switched on in this build. Safe to import anywhere, including the browser.
// It is decided at build time: the Supabase URL is present, or the local stand-in was requested.
export const QUIZZES_ON =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) || process.env.NEXT_PUBLIC_ARPELIO_LOCAL === '1';

// Email-link sign-in needs a mail service connected to Supabase (docs/online-quizzes-setup.md, step 5).
// Set NEXT_PUBLIC_ARPELIO_EMAIL_SIGNIN=off to launch with Google sign-in only until that is done.
export const EMAIL_SIGNIN_ON = process.env.NEXT_PUBLIC_ARPELIO_EMAIL_SIGNIN !== 'off';

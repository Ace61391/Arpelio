import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { quizzesEnabled, isLocal, sessionClient, rpc, safeNext } from '@/lib/quiz/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NEXT_COOKIE = 'arpelio_next';
// The emailed link is a sign-in link and nothing else (no password recovery, invites or email changes here).
const LINK_TYPES = ['email', 'magiclink', 'signup'];

// Where Google and the emailed sign-in link send the teacher back to.
// Handles both shapes Supabase uses: ?code= (OAuth and same-browser links) and ?token_hash= (links opened anywhere).
export async function GET(request) {
  const url = new URL(request.url);
  const remembered = cookies().get(NEXT_COOKIE)?.value;
  const next = safeNext(url.searchParams.get('next') || remembered); // Next has already URL-decoded the cookie
  const fail = () => NextResponse.redirect(new URL(`/login?error=link&next=${encodeURIComponent(next)}`, url.origin));
  if (!quizzesEnabled()) return new Response('Not found', { status: 404 });
  if (isLocal()) return fail();

  const supabase = sessionClient();
  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');

  let error = null;
  if (code) ({ error } = await supabase.auth.exchangeCodeForSession(code));
  else if (tokenHash && LINK_TYPES.includes(type)) ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }));
  else return fail();
  if (error) return fail();

  const { data } = await supabase.auth.getUser();
  if (!data?.user) return fail();
  // The dashboard and the create-quiz route also do this, so a hiccup here must not strand a signed-in teacher.
  try { await rpc('teacher_ensure', { p_id: data.user.id, p_email: data.user.email }); } catch (e) { console.error('[quiz]', e); }
  const response = NextResponse.redirect(new URL(next, url.origin));
  response.cookies.set(NEXT_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}

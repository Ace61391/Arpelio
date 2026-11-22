import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isLocal, safeNext, DEV_COOKIE } from '@/lib/quiz/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Sign-in for the local stand-in only (ARPELIO_LOCAL=1, never on Vercel). Anywhere else this route does not exist.
export async function POST(request) {
  if (!isLocal()) return new Response('Not found', { status: 404 });
  const form = await request.formData();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const next = safeNext(String(form.get('next') || ''));
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.redirect(new URL('/login?error=email', request.url), 303);
  cookies().set(DEV_COOKIE, email, { httpOnly: true, sameSite: 'lax', path: '/' });
  return NextResponse.redirect(new URL(next, request.url), 303);
}

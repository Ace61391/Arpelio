import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { quizzesEnabled, isLocal, sessionClient, sameOrigin, DEV_COOKIE } from '@/lib/quiz/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const home = new URL('/', request.url);
  if (!quizzesEnabled() || !sameOrigin(request)) return NextResponse.redirect(home, 303);
  if (isLocal()) cookies().delete(DEV_COOKIE);
  else await sessionClient().auth.signOut();
  return NextResponse.redirect(home, 303);
}

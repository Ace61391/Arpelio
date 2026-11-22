import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Keeps the teacher's Supabase session fresh on the pages and routes that need it.
// Everything else on the site is static and never passes through here.
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/api/me', '/api/quizzes/:path*', '/api/attempts/:path*'],
};

export async function middleware(request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(list) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  // Refreshes an expired session and writes the new cookies onto the response.
  await supabase.auth.getUser();
  return response;
}

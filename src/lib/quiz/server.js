// Server-only helpers for online quizzes: who the teacher is, and the one door to the database.
// Do not import this from a client component.
import crypto from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Supabase calls these the publishable and secret keys; older projects call them anon and service_role.
export const SUPABASE_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const DEV_COOKIE = 'arpelio_dev_teacher';

// The local stand-in (dev/local-db.mjs) is for development and tests only. It can never switch on on Vercel.
export const isLocal = () => process.env.ARPELIO_LOCAL === '1' && !process.env.VERCEL;

export const quizzesEnabled = () =>
  isLocal() || Boolean(SUPABASE_URL && SUPABASE_PUBLIC_KEY && SUPABASE_SECRET_KEY);

async function local() {
  // webpackIgnore keeps the stand-in (and the Postgres build it loads) out of the production bundle.
  const url = pathToFileURL(path.join(process.cwd(), 'dev', 'local-db.mjs')).href;
  const mod = await import(/* webpackIgnore: true */ url);
  return mod.localDb();
}

let admin;
function adminClient() {
  admin ||= createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}

// Call one of the database functions in supabase/migrations. Returns its jsonb result.
export async function rpc(fn, args = {}) {
  if (isLocal()) return (await local()).rpc(fn, args);
  const { data, error } = await adminClient().rpc(fn, args);
  if (error) throw new Error(`${fn}: ${error.message}`);
  return data;
}

// A Supabase client bound to this request's cookies, for reading the teacher's session.
export function sessionClient() {
  const store = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY, {
    cookies: {
      getAll() { return store.getAll(); },
      setAll(list) {
        // Server Components cannot set cookies; the middleware refreshes the session for them.
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch {}
      },
    },
  });
}

// The signed-in teacher, or null. Always asks Supabase Auth, so a forged cookie gets nowhere.
export async function getTeacher() {
  if (!quizzesEnabled()) return null;
  if (isLocal()) {
    const email = cookies().get(DEV_COOKIE)?.value;
    if (!email) return null;
    const db = await local();
    const user = await db.devUser(email);
    await db.rpc('teacher_ensure', { p_id: user.id, p_email: user.email });
    return { id: user.id, email: user.email };
  }
  const { data, error } = await sessionClient().auth.getUser();
  if (error || !data?.user) return null;
  return { id: data.user.id, email: data.user.email };
}

// Where to send someone after sign-in: only ever a path on this site.
export function safeNext(value, fallback = '/dashboard') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  return value;
}

// Refuse a state-changing request that a different site's page is making on the teacher's behalf.
export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === request.headers.get('host'); } catch { return false; }
}

// Share codes: 8 characters, no look-alikes (0/o, 1/l/i), about 8 x 10^11 possibilities.
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
export function newShareCode(length = 8) {
  let out = '';
  for (let i = 0; i < length; i++) out += ALPHABET[crypto.randomInt(ALPHABET.length)];
  return out;
}

export const isShareCode = (code) => typeof code === 'string' && /^[a-z0-9]{6,16}$/.test(code);
export const isUuid = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });

// Wrap an API route so a database or network failure (for example a paused Supabase project) becomes a clean
// 503 the page can explain, not a bare 500.
export const guarded = (handler) => async (...args) => {
  try { return await handler(...args); }
  catch (e) {
    console.error('[quiz]', e);
    return json({ error: 'unavailable', message: 'Arpelio could not reach its quiz service. Try again in a minute.' }, 503);
  }
};

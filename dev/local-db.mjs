// A local stand-in for the Supabase database: real Postgres (PGlite, in memory) running the same
// migration files. Used by the tests and by `ARPELIO_LOCAL=1 npm run dev|start`. Never loaded in production:
// src/lib/quiz/db.js imports this file only when ARPELIO_LOCAL=1 and the code is not running on Vercel.
import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';

// What a Supabase project already has that a bare Postgres does not.
const PRELUDE = `
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), email text unique not null);
  -- Like a Supabase project created after May 2026: new tables and functions in public are NOT granted
  -- to the API roles automatically, and nobody but the owner can execute a new function.
  revoke all on schema public from public;
  grant usage on schema public to anon, authenticated;
  alter default privileges in schema public revoke execute on functions from public;
`;

export async function createLocalDb(root = process.cwd()) {
  const db = new PGlite();
  await db.exec(PRELUDE);
  const dir = path.join(root, 'supabase', 'migrations');
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
    await db.exec(fs.readFileSync(path.join(dir, file), 'utf8'));
  }

  return {
    raw: db,
    // Same contract as supabase.rpc(): named arguments in, the function's jsonb result out.
    async rpc(fn, args = {}) {
      if (!/^[a-z_]+$/.test(fn)) throw new Error(`bad function name: ${fn}`);
      const keys = Object.keys(args);
      for (const k of keys) if (!/^p_[a-z_]+$/.test(k)) throw new Error(`bad argument name: ${k}`);
      const sql = `select public.${fn}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')}) as result`;
      // Run as service_role, the role the secret key maps to, so missing grants fail here and not in production.
      return db.transaction(async (tx) => {
        await tx.exec('set local role service_role');
        const { rows } = await tx.query(sql, keys.map((k) => args[k]));
        return rows[0].result;
      });
    },
    // Stand-in for Supabase Auth: one row per email.
    async devUser(email) {
      const { rows } = await db.query(
        'insert into auth.users (email) values ($1) on conflict (email) do update set email = excluded.email returning id, email',
        [email],
      );
      return rows[0];
    },
  };
}

// One database per server process, shared by every route.
export function localDb() {
  globalThis.__arpelioLocalDb ||= createLocalDb();
  return globalThis.__arpelioLocalDb;
}

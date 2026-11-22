'use client';
// The browser's Supabase client, used only on the sign-in page.
import { createBrowserClient } from '@supabase/ssr';

let client;
export function browserClient() {
  client ||= createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  return client;
}

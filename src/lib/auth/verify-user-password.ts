import { createClient } from '@supabase/supabase-js';
import 'server-only';

import { env } from '@/env';
import type { Database } from '@/lib/db/database.types';

// Checks a password for `email` against Supabase Auth without touching the caller's
// session. This throwaway client keeps its session in memory only (persistSession:
// false) and never writes auth cookies, so verifying a password from a Server Action
// cannot rotate or drop the logged-in user's session the way calling signInWithPassword
// on the cookie-backed SSR client would.
export async function verifyUserPassword(email: string, password: string): Promise<boolean> {
  const client = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const { data, error } = await client.auth.signInWithPassword({ email, password });
  return Boolean(!error && data.user);
}

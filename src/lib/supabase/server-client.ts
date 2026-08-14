import { cookies } from 'next/headers';

import { createServerClient } from '@supabase/ssr';
import 'server-only';

import { env } from '@/env';
import type { Database } from '@/lib/db/database.types';

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서 호출된 경우 쿠키 쓰기가 무시됨. 세션 갱신은 proxy가 담당.
          }
        },
      },
    },
  );
}

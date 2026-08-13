import { createClient } from '@supabase/supabase-js';
import 'server-only';

import { env } from '@/env';
import type { Database } from '@/lib/db/database.types';

export function createServiceRoleClient() {
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

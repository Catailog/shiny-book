import type { User } from '@supabase/supabase-js';
import 'server-only';

import { isAdminRole } from '@/lib/auth/is-admin-role';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

export async function getCurrentConsumer(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || isAdminRole(user.app_metadata.role)) {
    return null;
  }

  return user;
}

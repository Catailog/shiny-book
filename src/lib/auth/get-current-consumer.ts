import type { User } from '@supabase/supabase-js';
import 'server-only';

import { isAdminRole } from '@/lib/auth/is-admin-role';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface ConsumerUser extends User {
  displayName: string;
}

export async function getCurrentConsumer(): Promise<ConsumerUser | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || isAdminRole(user.app_metadata.role)) {
    return null;
  }

  const { data: profile } = await createServiceRoleClient()
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .maybeSingle();

  return { ...user, displayName: profile?.display_name ?? '' };
}

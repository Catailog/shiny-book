import 'server-only';

import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getProfileEmailsByIds(ids: string[]): Promise<Record<string, string>> {
  if (ids.length === 0) {
    return {};
  }

  const supabase = createServiceRoleClient();
  const { data } = await supabase.from('profiles').select('id, email').in('id', ids);

  const emailsById: Record<string, string> = {};
  for (const profile of data ?? []) {
    if (profile.email) {
      emailsById[profile.id] = profile.email;
    }
  }

  return emailsById;
}

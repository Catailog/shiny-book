import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getAnnouncements(limit: number): Promise<Tables<'announcements'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('announcements')
    .select()
    .order('created_at', { ascending: false })
    .limit(limit);

  return data ?? [];
}

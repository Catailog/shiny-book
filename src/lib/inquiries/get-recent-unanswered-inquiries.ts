import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getRecentUnansweredInquiries(
  limit: number,
): Promise<Pick<Tables<'inquiries'>, 'id' | 'title' | 'created_at'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('inquiries')
    .select('id, title, created_at')
    .is('answered_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  return data ?? [];
}

import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getFaqs(limit: number): Promise<Tables<'faqs'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('faqs')
    .select()
    .order('created_at', { ascending: false })
    .limit(limit);

  return data ?? [];
}

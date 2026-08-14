import 'server-only';

import { CONSUMER_INQUIRY_LIST_LIMIT } from '@/constants/inquiry';
import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getInquiriesByConsumer(consumerId: string): Promise<Tables<'inquiries'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('inquiries')
    .select()
    .eq('consumer_id', consumerId)
    .order('created_at', { ascending: false })
    .limit(CONSUMER_INQUIRY_LIST_LIMIT);

  return data ?? [];
}

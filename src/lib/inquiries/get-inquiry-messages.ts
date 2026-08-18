import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getInquiryMessages(inquiryId: string): Promise<Tables<'inquiry_messages'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('inquiry_messages')
    .select()
    .eq('inquiry_id', inquiryId)
    .order('created_at', { ascending: true });

  return data ?? [];
}

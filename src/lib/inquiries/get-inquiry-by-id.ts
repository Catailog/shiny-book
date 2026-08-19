import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getInquiryById(id: string): Promise<Tables<'inquiries'> | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from('inquiries').select().eq('id', id).maybeSingle();
  return data;
}

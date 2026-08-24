import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getCouponById(id: string): Promise<Tables<'coupons'> | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from('coupons').select().eq('id', id).maybeSingle();
  return data;
}

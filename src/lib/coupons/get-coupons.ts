import 'server-only';

import { ADMIN_COUPON_LIST_LIMIT } from '@/constants/coupon';
import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getCoupons(): Promise<Tables<'coupons'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('coupons')
    .select()
    .order('created_at', { ascending: false })
    .limit(ADMIN_COUPON_LIST_LIMIT);

  return data ?? [];
}

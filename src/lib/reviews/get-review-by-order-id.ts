import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getReviewByOrderId(orderId: string): Promise<Tables<'reviews'> | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from('reviews').select().eq('order_id', orderId).maybeSingle();
  return data;
}

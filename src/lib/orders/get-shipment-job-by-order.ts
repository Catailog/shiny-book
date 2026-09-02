import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// The most recent shipment job for an order. Null before a courier has picked
// the order up, and for orders that never ship (external API orders).
export async function getShipmentJobByOrder(
  orderId: string,
): Promise<Tables<'shipment_jobs'> | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('shipment_jobs')
    .select()
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

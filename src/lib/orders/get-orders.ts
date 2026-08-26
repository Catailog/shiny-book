import 'server-only';

import { ADMIN_ORDER_LIST_LIMIT } from '@/constants/admin';
import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface OrderWithConsumerName extends Tables<'orders'> {
  consumerName: string | null;
}

export async function getOrders(): Promise<OrderWithConsumerName[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('orders')
    .select()
    .order('created_at', { ascending: false })
    .limit(ADMIN_ORDER_LIST_LIMIT);

  if (!data) {
    return [];
  }

  const consumerIds = [
    ...new Set(
      data
        .map((order) => order.consumer_id)
        .filter((consumerId): consumerId is string => consumerId !== null),
    ),
  ];

  const { data: profiles } =
    consumerIds.length > 0
      ? await supabase.from('profiles').select('id, display_name').in('id', consumerIds)
      : { data: [] };
  const displayNameByConsumerId = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.display_name]),
  );

  return data.map((order) => ({
    ...order,
    consumerName: order.consumer_id
      ? (displayNameByConsumerId.get(order.consumer_id) ?? null)
      : null,
  }));
}

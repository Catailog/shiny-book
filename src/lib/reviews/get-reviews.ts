import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface ReviewWithOrderTitle extends Tables<'reviews'> {
  orderTitle: string;
}

export async function getReviews(limit: number): Promise<ReviewWithOrderTitle[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('reviews')
    .select('*, orders(title)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!data) {
    return [];
  }

  return data.map(({ orders, ...review }) => ({
    ...review,
    orderTitle: orders?.title ?? '',
  }));
}

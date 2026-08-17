import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getReviewsByConsumer(consumerId: string): Promise<Tables<'reviews'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from('reviews').select().eq('consumer_id', consumerId);

  return data ?? [];
}

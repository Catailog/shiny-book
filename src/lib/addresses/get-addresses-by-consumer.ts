import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getAddressesByConsumer(consumerId: string): Promise<Tables<'addresses'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('addresses')
    .select()
    .eq('consumer_id', consumerId)
    .is('deleted_at', null)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  return data ?? [];
}

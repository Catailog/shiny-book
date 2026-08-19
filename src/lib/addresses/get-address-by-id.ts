import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getAddressById(id: string): Promise<Tables<'addresses'> | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from('addresses').select().eq('id', id).maybeSingle();
  return data;
}

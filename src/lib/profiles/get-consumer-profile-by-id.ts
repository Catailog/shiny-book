import 'server-only';

import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface ConsumerProfile {
  displayName: string | null;
  email: string | null;
}

export async function getConsumerProfileById(id: string): Promise<ConsumerProfile | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('profiles')
    .select('display_name, email')
    .eq('id', id)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return { displayName: data.display_name, email: data.email };
}

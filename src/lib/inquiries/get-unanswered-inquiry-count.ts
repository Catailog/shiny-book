import 'server-only';

import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getUnansweredInquiryCount(): Promise<number> {
  const supabase = createServiceRoleClient();
  const { count } = await supabase
    .from('inquiries')
    .select('id', { count: 'exact', head: true })
    .is('answered_at', null);

  return count ?? 0;
}

import 'server-only';

import { INQUIRY_MESSAGE_PAGE_SIZE } from '@/constants/inquiry';
import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface InquiryMessagesPage {
  messages: Tables<'inquiry_messages'>[];
  hasMore: boolean;
}

export async function getInquiryMessagesPage(
  inquiryId: string,
  options: { before?: string } = {},
): Promise<InquiryMessagesPage> {
  const supabase = createServiceRoleClient();
  const query = supabase
    .from('inquiry_messages')
    .select()
    .eq('inquiry_id', inquiryId)
    .order('created_at', { ascending: false })
    .limit(INQUIRY_MESSAGE_PAGE_SIZE + 1);

  const { data } = await (options.before ? query.lt('created_at', options.before) : query);
  const rows = data ?? [];
  const hasMore = rows.length > INQUIRY_MESSAGE_PAGE_SIZE;
  const messages = rows.slice(0, INQUIRY_MESSAGE_PAGE_SIZE).reverse();

  return { messages, hasMore };
}

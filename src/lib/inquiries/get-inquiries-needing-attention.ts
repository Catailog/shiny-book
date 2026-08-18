import 'server-only';

import { ADMIN_INQUIRY_LIST_LIMIT, INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export type InquiryNeedingAttention = Pick<
  Tables<'inquiries'>,
  'id' | 'title' | 'created_at' | 'answered_at'
>;

export async function getInquiriesNeedingAttention(): Promise<InquiryNeedingAttention[]> {
  const supabase = createServiceRoleClient();
  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('id, title, created_at, answered_at')
    .order('created_at', { ascending: false })
    .limit(ADMIN_INQUIRY_LIST_LIMIT);

  if (!inquiries) {
    return [];
  }

  const answeredIds = inquiries
    .filter((inquiry) => inquiry.answered_at !== null)
    .map((inquiry) => inquiry.id);

  const lastMessageAuthorByInquiryId = new Map<string, string>();
  if (answeredIds.length > 0) {
    const { data: messages } = await supabase
      .from('inquiry_messages')
      .select('inquiry_id, author_type, created_at')
      .in('inquiry_id', answeredIds)
      .order('created_at', { ascending: false });

    for (const message of messages ?? []) {
      if (!lastMessageAuthorByInquiryId.has(message.inquiry_id)) {
        lastMessageAuthorByInquiryId.set(message.inquiry_id, message.author_type);
      }
    }
  }

  return inquiries.filter((inquiry) => {
    if (inquiry.answered_at === null) {
      return true;
    }
    return lastMessageAuthorByInquiryId.get(inquiry.id) === INQUIRY_MESSAGE_AUTHOR.CONSUMER;
  });
}

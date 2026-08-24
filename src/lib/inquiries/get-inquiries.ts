import 'server-only';

import { ADMIN_INQUIRY_LIST_LIMIT, INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface InquiryWithConsumerEmail extends Tables<'inquiries'> {
  consumerEmail: string | null;
  hasNewConsumerReply: boolean;
}

export async function getInquiries(): Promise<InquiryWithConsumerEmail[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('inquiries')
    .select()
    .order('created_at', { ascending: false })
    .limit(ADMIN_INQUIRY_LIST_LIMIT);

  if (!data) {
    return [];
  }

  const inquiryIds = data.map((inquiry) => inquiry.id);
  const { data: messages } = await supabase
    .from('inquiry_messages')
    .select('inquiry_id, author_type, created_at')
    .in('inquiry_id', inquiryIds)
    .order('created_at', { ascending: false });

  const lastMessageAuthorByInquiryId = new Map<string, string>();
  for (const message of messages ?? []) {
    if (!lastMessageAuthorByInquiryId.has(message.inquiry_id)) {
      lastMessageAuthorByInquiryId.set(message.inquiry_id, message.author_type);
    }
  }

  return Promise.all(
    data.map(async (inquiry) => {
      const userData = inquiry.consumer_id
        ? (await supabase.auth.admin.getUserById(inquiry.consumer_id)).data
        : null;
      const lastMessageAuthor = lastMessageAuthorByInquiryId.get(inquiry.id) ?? null;
      const hasNewConsumerReply =
        inquiry.answered_at !== null && lastMessageAuthor === INQUIRY_MESSAGE_AUTHOR.CONSUMER;

      return {
        ...inquiry,
        consumerEmail: userData?.user?.email ?? null,
        hasNewConsumerReply,
      };
    }),
  );
}

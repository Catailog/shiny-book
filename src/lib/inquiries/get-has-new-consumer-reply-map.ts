import 'server-only';

import { INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import type { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getHasNewConsumerReplyMap(
  supabase: ReturnType<typeof createServiceRoleClient>,
  inquiryIds: string[],
  answeredAtByInquiryId: Map<string, string | null>,
): Promise<Map<string, boolean>> {
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

  const hasNewConsumerReplyByInquiryId = new Map<string, boolean>();
  for (const inquiryId of inquiryIds) {
    const lastMessageAuthor = lastMessageAuthorByInquiryId.get(inquiryId) ?? null;
    const answeredAt = answeredAtByInquiryId.get(inquiryId) ?? null;
    hasNewConsumerReplyByInquiryId.set(
      inquiryId,
      answeredAt !== null && lastMessageAuthor === INQUIRY_MESSAGE_AUTHOR.CONSUMER,
    );
  }

  return hasNewConsumerReplyByInquiryId;
}

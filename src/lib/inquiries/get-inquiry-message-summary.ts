import 'server-only';

import { INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import type { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface InquiryMessageSummary {
  hasNewConsumerReply: boolean;
  lastMessageCreatedAt: string | null;
}

export async function getInquiryMessageSummaryMap(
  supabase: ReturnType<typeof createServiceRoleClient>,
  inquiryIds: string[],
  answeredAtByInquiryId: Map<string, string | null>,
): Promise<Map<string, InquiryMessageSummary>> {
  const { data: messages } = await supabase
    .from('inquiry_messages')
    .select('inquiry_id, author_type, created_at')
    .in('inquiry_id', inquiryIds)
    .order('created_at', { ascending: false });

  const lastMessageByInquiryId = new Map<string, { authorType: string; createdAt: string }>();
  for (const message of messages ?? []) {
    if (!lastMessageByInquiryId.has(message.inquiry_id)) {
      lastMessageByInquiryId.set(message.inquiry_id, {
        authorType: message.author_type,
        createdAt: message.created_at,
      });
    }
  }

  const summaryByInquiryId = new Map<string, InquiryMessageSummary>();
  for (const inquiryId of inquiryIds) {
    const lastMessage = lastMessageByInquiryId.get(inquiryId) ?? null;
    const answeredAt = answeredAtByInquiryId.get(inquiryId) ?? null;
    summaryByInquiryId.set(inquiryId, {
      hasNewConsumerReply:
        answeredAt !== null && lastMessage?.authorType === INQUIRY_MESSAGE_AUTHOR.CONSUMER,
      lastMessageCreatedAt: lastMessage?.createdAt ?? null,
    });
  }

  return summaryByInquiryId;
}

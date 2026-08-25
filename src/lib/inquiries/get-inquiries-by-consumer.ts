import 'server-only';

import { CONSUMER_INQUIRY_LIST_LIMIT } from '@/constants/inquiry';
import type { Tables } from '@/lib/db/database.types';
import { getHasNewConsumerReplyMap } from '@/lib/inquiries/get-has-new-consumer-reply-map';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface InquiryWithNewReplyFlag extends Tables<'inquiries'> {
  hasNewConsumerReply: boolean;
  orderTitle: string | null;
}

export async function getInquiriesByConsumer(
  consumerId: string,
): Promise<InquiryWithNewReplyFlag[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('inquiries')
    .select('*, orders(title)')
    .eq('consumer_id', consumerId)
    .order('created_at', { ascending: false })
    .limit(CONSUMER_INQUIRY_LIST_LIMIT);

  if (!data) {
    return [];
  }

  const inquiryIds = data.map((inquiry) => inquiry.id);
  const answeredAtByInquiryId = new Map(data.map((inquiry) => [inquiry.id, inquiry.answered_at]));
  const hasNewConsumerReplyByInquiryId = await getHasNewConsumerReplyMap(
    supabase,
    inquiryIds,
    answeredAtByInquiryId,
  );

  return data.map(({ orders, ...inquiry }) => ({
    ...inquiry,
    hasNewConsumerReply: hasNewConsumerReplyByInquiryId.get(inquiry.id) ?? false,
    orderTitle: orders?.title ?? null,
  }));
}

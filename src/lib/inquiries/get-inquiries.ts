import 'server-only';

import { ADMIN_INQUIRY_LIST_LIMIT } from '@/constants/inquiry';
import type { Tables } from '@/lib/db/database.types';
import { getInquiryMessageSummaryMap } from '@/lib/inquiries/get-inquiry-message-summary';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface InquiryWithConsumerEmail extends Tables<'inquiries'> {
  consumerEmail: string | null;
  hasNewConsumerReply: boolean;
  lastMessageAt: string;
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
  const answeredAtByInquiryId = new Map(data.map((inquiry) => [inquiry.id, inquiry.answered_at]));
  const summaryByInquiryId = await getInquiryMessageSummaryMap(
    supabase,
    inquiryIds,
    answeredAtByInquiryId,
  );

  return Promise.all(
    data.map(async (inquiry) => {
      const userData = inquiry.consumer_id
        ? (await supabase.auth.admin.getUserById(inquiry.consumer_id)).data
        : null;
      const summary = summaryByInquiryId.get(inquiry.id);

      return {
        ...inquiry,
        consumerEmail: userData?.user?.email ?? null,
        hasNewConsumerReply: summary?.hasNewConsumerReply ?? false,
        lastMessageAt: summary?.lastMessageCreatedAt ?? inquiry.created_at,
      };
    }),
  );
}

import 'server-only';

import { ADMIN_INQUIRY_LIST_LIMIT } from '@/constants/inquiry';
import type { Tables } from '@/lib/db/database.types';
import { getInquiryMessageSummaryMap } from '@/lib/inquiries/get-inquiry-message-summary';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface InquiryWithConsumerInfo extends Tables<'inquiries'> {
  consumerDisplayName: string | null;
  consumerEmail: string | null;
  hasNewConsumerReply: boolean;
  lastMessageAt: string;
}

export async function getInquiries(): Promise<InquiryWithConsumerInfo[]> {
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

  const consumerIds = [
    ...new Set(
      data.map((inquiry) => inquiry.consumer_id).filter((id): id is string => id !== null),
    ),
  ];
  const { data: profiles } =
    consumerIds.length > 0
      ? await supabase.from('profiles').select('id, display_name, email').in('id', consumerIds)
      : { data: [] };
  const profileByConsumerId = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return data.map((inquiry) => {
    const profile = inquiry.consumer_id ? profileByConsumerId.get(inquiry.consumer_id) : undefined;
    const summary = summaryByInquiryId.get(inquiry.id);

    return {
      ...inquiry,
      consumerDisplayName: profile?.display_name ?? null,
      consumerEmail: profile?.email ?? null,
      hasNewConsumerReply: summary?.hasNewConsumerReply ?? false,
      lastMessageAt: summary?.lastMessageCreatedAt ?? inquiry.created_at,
    };
  });
}

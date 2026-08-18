import 'server-only';

import { getInquiriesNeedingAttention } from '@/lib/inquiries/get-inquiries-needing-attention';

export async function getUnansweredInquiryCount(): Promise<number> {
  const inquiries = await getInquiriesNeedingAttention();
  return inquiries.length;
}

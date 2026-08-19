import 'server-only';

import { getInquiriesNeedingAttention } from '@/lib/inquiries/get-inquiries-needing-attention';

export async function getRecentUnansweredInquiries(
  limit: number,
): Promise<{ id: string; title: string; created_at: string }[]> {
  const inquiries = await getInquiriesNeedingAttention();
  return inquiries.slice(0, limit).map(({ id, title, created_at }) => ({ id, title, created_at }));
}

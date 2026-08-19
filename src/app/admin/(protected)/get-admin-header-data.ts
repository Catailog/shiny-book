'use server';

import { ADMIN_NOTIFICATION_DROPDOWN_LIMIT } from '@/constants/inquiry';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { getRecentUnansweredInquiries } from '@/lib/inquiries/get-recent-unanswered-inquiries';
import { getUnansweredInquiryCount } from '@/lib/inquiries/get-unanswered-inquiry-count';

export interface AdminHeaderData {
  email: string;
  unansweredCount: number;
  recentInquiries: { id: string; title: string; created_at: string }[];
}

export async function getAdminHeaderData(): Promise<AdminHeaderData> {
  const [admin, unansweredCount, recentInquiries] = await Promise.all([
    getCurrentAdmin(),
    getUnansweredInquiryCount(),
    getRecentUnansweredInquiries(ADMIN_NOTIFICATION_DROPDOWN_LIMIT),
  ]);

  return {
    email: admin?.email ?? '',
    unansweredCount,
    recentInquiries,
  };
}

import type { ReactNode } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ADMIN_NOTIFICATION_DROPDOWN_LIMIT } from '@/constants/inquiry';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { getRecentUnansweredInquiries } from '@/lib/inquiries/get-recent-unanswered-inquiries';
import { getUnansweredInquiryCount } from '@/lib/inquiries/get-unanswered-inquiry-count';
import { defaultLocale, locales } from '@/locales';

import { AdminNotificationBell } from './admin-notification-bell';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export async function AdminTopbar({ title, subtitle, actions }: AdminTopbarProps) {
  const t = locales[defaultLocale];
  const [admin, unansweredCount, recentInquiries] = await Promise.all([
    getCurrentAdmin(),
    getUnansweredInquiryCount(),
    getRecentUnansweredInquiries(ADMIN_NOTIFICATION_DROPDOWN_LIMIT),
  ]);
  const adminEmail = admin?.email ?? '';

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-10 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <AdminNotificationBell
          unansweredCount={unansweredCount}
          recentInquiries={recentInquiries}
        />
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback>{adminEmail.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{adminEmail}</span>
            <span className="text-xs text-muted-foreground">{t.admin.portalLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

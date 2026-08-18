import type { ReactNode } from 'react';

import { Bell } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ADMIN_NOTIFICATION_BADGE_MAX } from '@/constants/inquiry';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { getUnansweredInquiryCount } from '@/lib/inquiries/get-unanswered-inquiry-count';
import { defaultLocale, locales } from '@/locales';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export async function AdminTopbar({ title, subtitle, actions }: AdminTopbarProps) {
  const t = locales[defaultLocale];
  const [admin, unansweredCount] = await Promise.all([
    getCurrentAdmin(),
    getUnansweredInquiryCount(),
  ]);
  const adminEmail = admin?.email ?? '';
  const notificationBadgeLabel =
    unansweredCount > ADMIN_NOTIFICATION_BADGE_MAX
      ? `${ADMIN_NOTIFICATION_BADGE_MAX}+`
      : String(unansweredCount);

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-10 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <button
          type="button"
          aria-label={t.admin.notificationsLabel}
          className="relative flex size-9 items-center justify-center rounded-full bg-muted text-foreground"
        >
          <Bell aria-hidden="true" className="size-4.5" />
          {unansweredCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-primary-foreground">
              {notificationBadgeLabel}
            </span>
          ) : null}
        </button>
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

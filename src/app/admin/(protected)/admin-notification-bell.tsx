'use client';

import Link from 'next/link';

import { Bell } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ADMIN_NOTIFICATION_BADGE_MAX } from '@/constants/inquiry';
import { ADMIN_ROUTES } from '@/constants/routes';
import { formatDateTime } from '@/lib/format-date';
import { defaultLocale, locales } from '@/locales';

interface RecentInquiry {
  id: string;
  title: string;
  created_at: string;
}

interface AdminNotificationBellProps {
  unansweredCount: number;
  recentInquiries: RecentInquiry[];
}

export function AdminNotificationBell({
  unansweredCount,
  recentInquiries,
}: AdminNotificationBellProps) {
  const t = locales[defaultLocale];
  const badgeLabel =
    unansweredCount > ADMIN_NOTIFICATION_BADGE_MAX
      ? `${ADMIN_NOTIFICATION_BADGE_MAX}+`
      : String(unansweredCount);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={t.admin.notificationsLabel}
            className="relative flex size-9 items-center justify-center rounded-full bg-muted text-foreground"
          >
            <Bell aria-hidden="true" className="size-4.5" />
            {unansweredCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-primary-foreground">
                {badgeLabel}
              </span>
            ) : null}
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
          {t.admin.notificationsLabel}
        </div>
        <DropdownMenuSeparator />
        {recentInquiries.length === 0 ? (
          <p className="px-1.5 py-3 text-center text-sm text-muted-foreground">
            {t.admin.notificationsEmptyLabel}
          </p>
        ) : (
          recentInquiries.map((inquiry) => (
            <DropdownMenuItem
              key={inquiry.id}
              render={<Link href={`${ADMIN_ROUTES.INQUIRIES}/${inquiry.id}`} />}
              className="flex-col items-start gap-0.5 py-2"
            >
              <span className="w-full truncate font-medium text-foreground">{inquiry.title}</span>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(inquiry.created_at)}
              </span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href={ADMIN_ROUTES.INQUIRIES} />}
          className="justify-center"
        >
          {t.admin.notificationsViewAllLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

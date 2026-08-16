import type { ReactNode } from 'react';

import { Bell } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getLocale } from '@/lib/i18n/get-locale';
import { MOCK_ADMIN } from '@/lib/mock/mock-accounts';
import { locales } from '@/locales';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export async function AdminTopbar({ title, subtitle, actions }: AdminTopbarProps) {
  const locale = await getLocale();
  const t = locales[locale];

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
          className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground"
        >
          <Bell aria-hidden="true" className="size-4.5" />
        </button>
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback>{MOCK_ADMIN.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{MOCK_ADMIN.name}</span>
            <span className="text-xs text-muted-foreground">{t.admin.portalLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

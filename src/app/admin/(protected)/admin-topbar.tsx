import type { ReactNode } from 'react';

import { AdminHeaderWidgets } from './admin-header-widgets';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function AdminTopbar({ title, subtitle, actions }: AdminTopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-10 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <AdminHeaderWidgets />
      </div>
    </header>
  );
}

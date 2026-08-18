'use client';

import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { defaultLocale, locales } from '@/locales';

import { AdminNotificationBell } from './admin-notification-bell';
import { type AdminHeaderData, getAdminHeaderData } from './get-admin-header-data';

const EMPTY_HEADER_DATA: AdminHeaderData = {
  email: '',
  unansweredCount: 0,
  recentInquiries: [],
};

export function AdminHeaderWidgets() {
  const t = locales[defaultLocale];
  const [data, setData] = useState(EMPTY_HEADER_DATA);

  useEffect(() => {
    let isMounted = true;

    getAdminHeaderData().then((result) => {
      if (isMounted) {
        setData(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <AdminNotificationBell
        unansweredCount={data.unansweredCount}
        recentInquiries={data.recentInquiries}
      />
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarFallback>{data.email.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{data.email}</span>
          <span className="text-xs text-muted-foreground">{t.admin.portalLabel}</span>
        </div>
      </div>
    </>
  );
}

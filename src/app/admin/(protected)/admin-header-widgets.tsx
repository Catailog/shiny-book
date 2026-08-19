'use client';

import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

import { AdminNotificationBell } from './admin-notification-bell';
import { type AdminHeaderData, getAdminHeaderData } from './get-admin-header-data';

const EMPTY_HEADER_DATA: AdminHeaderData = {
  email: '',
  unansweredCount: 0,
  recentInquiries: [],
};

export function AdminHeaderWidgets() {
  const [data, setData] = useState(EMPTY_HEADER_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminHeaderData().then((result) => {
      if (isMounted) {
        setData(result);
        setIsLoaded(true);
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
        {isLoaded ? (
          <Avatar className="size-9">
            <AvatarFallback>{data.email.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
        ) : (
          <Skeleton className="size-9 rounded-full" />
        )}
        {isLoaded ? (
          <span className="text-sm font-semibold text-foreground">{data.email}</span>
        ) : (
          <Skeleton className="h-4 w-36" />
        )}
      </div>
    </>
  );
}

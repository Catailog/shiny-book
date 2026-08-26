'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MessageSquare, Package, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';
import { cn } from '@/lib/utils';

interface MypageSidebarProps {
  consumerName: string;
  consumerEmail: string;
  avatarUrl: string | null;
}

export function MypageSidebar({ consumerName, consumerEmail, avatarUrl }: MypageSidebarProps) {
  const t = useT();
  const pathname = usePathname();

  const navItems = [
    { href: CONSUMER_ROUTES.MYPAGE, label: t.consumer.mypage.sidebar.orders, icon: Package },
    { href: CONSUMER_ROUTES.ACCOUNT, label: t.consumer.mypage.sidebar.account, icon: User },
    {
      href: CONSUMER_ROUTES.INQUIRIES,
      label: t.consumer.mypage.sidebar.inquiries,
      icon: MessageSquare,
    },
  ];

  return (
    <aside className="flex w-70 shrink-0 flex-col gap-8 border-r border-border bg-muted px-6 py-8">
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={consumerName} /> : null}
          <AvatarFallback>{consumerName.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-heading text-lg font-bold text-foreground">{consumerName}</span>
          <span className="text-xs text-muted-foreground">{consumerEmail}</span>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === CONSUMER_ROUTES.MYPAGE
              ? pathname === item.href
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-soft font-semibold text-primary'
                  : 'text-muted-foreground hover:bg-card',
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu, MessageSquare, Package, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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

  function isActiveItem(href: string) {
    return href === CONSUMER_ROUTES.MYPAGE ? pathname === href : pathname.startsWith(href);
  }

  function navItemClassName(isActive: boolean) {
    return cn(
      'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary-soft font-semibold text-primary'
        : 'text-muted-foreground hover:bg-card',
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 border-b border-border bg-muted px-4 py-3 md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" aria-label={t.consumer.mypage.sidebar.openMenu} />
            }
          >
            <Menu aria-hidden="true" className="size-5" />
          </SheetTrigger>
          <SheetContent title={t.consumer.mypage.sidebar.menuTitle}>
            <MypageProfile
              consumerName={consumerName}
              consumerEmail={consumerEmail}
              avatarUrl={avatarUrl}
            />
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SheetClose
                    key={item.href}
                    render={<Link href={item.href} />}
                    className={navItemClassName(isActiveItem(item.href))}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {item.label}
                  </SheetClose>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
        <span className="font-heading text-base font-bold text-foreground">
          {t.consumer.mypage.title}
        </span>
      </div>
      <aside className="hidden w-70 shrink-0 flex-col gap-8 border-r border-border bg-muted px-6 py-8 md:flex">
        <MypageProfile
          consumerName={consumerName}
          consumerEmail={consumerEmail}
          avatarUrl={avatarUrl}
        />
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={navItemClassName(isActiveItem(item.href))}
              >
                <Icon aria-hidden="true" className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function MypageProfile({ consumerName, consumerEmail, avatarUrl }: MypageSidebarProps) {
  return (
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
  );
}

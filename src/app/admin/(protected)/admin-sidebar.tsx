'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Tag,
  Undo2,
  Volume2,
} from 'lucide-react';

import { ADMIN_ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { defaultLocale, locales } from '@/locales';

interface AdminSidebarProps {
  signOutAction: () => Promise<void>;
}

export function AdminSidebar({ signOutAction }: AdminSidebarProps) {
  const t = locales[defaultLocale];
  const pathname = usePathname();

  const navItems = [
    { href: ADMIN_ROUTES.DASHBOARD, label: t.admin.nav.dashboard, icon: LayoutDashboard },
    { href: ADMIN_ROUTES.PRODUCTS, label: t.admin.nav.products, icon: Package },
    { href: ADMIN_ROUTES.COUPONS, label: t.admin.nav.coupons, icon: Tag },
    { href: ADMIN_ROUTES.ANNOUNCEMENTS, label: t.admin.nav.announcements, icon: Volume2 },
    { href: ADMIN_ROUTES.FAQS, label: t.admin.nav.faqs, icon: HelpCircle },
    { href: ADMIN_ROUTES.INQUIRIES, label: t.admin.nav.inquiries, icon: MessageSquare },
    { href: ADMIN_ROUTES.REFUNDS, label: t.admin.nav.refunds, icon: Undo2 },
  ];

  return (
    <aside className="flex w-65 shrink-0 flex-col bg-ink px-5 py-8 text-ink-foreground">
      <div className="flex items-center gap-2 px-2">
        <BookOpen aria-hidden="true" className="size-6" />
        <span className="font-heading text-xl font-bold">Shiny Book</span>
      </div>
      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === ADMIN_ROUTES.DASHBOARD
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
                  ? 'bg-primary font-semibold text-primary-foreground'
                  : 'text-ink-foreground/80 hover:bg-ink-foreground/10',
              )}
            >
              <Icon aria-hidden="true" className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-ink-foreground/15 pt-4">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink-foreground/80 hover:bg-ink-foreground/10"
          >
            <LogOut aria-hidden="true" className="size-4.5" />
            {t.admin.nav.logout}
          </button>
        </form>
      </div>
    </aside>
  );
}

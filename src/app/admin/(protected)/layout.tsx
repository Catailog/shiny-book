import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ROLE } from '@/constants/roles';
import { ADMIN_ROUTES } from '@/constants/routes';
import { MOCK_ADMIN } from '@/lib/mock/mock-accounts';
import { getMockSessionRole } from '@/lib/mock/mock-session';
import { defaultLocale, locales } from '@/locales';

import { signOutAdmin } from './actions';

export default async function AdminLayout(props: LayoutProps<'/admin'>) {
  const role = await getMockSessionRole();
  if (role !== ROLE.ADMIN) {
    redirect(ADMIN_ROUTES.LOGIN);
  }

  const t = locales[defaultLocale];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            href={ADMIN_ROUTES.DASHBOARD}
            className="font-heading text-lg font-semibold text-foreground"
          >
            Shiny Book
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href={ADMIN_ROUTES.DASHBOARD}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t.admin.nav.orders}
            </Link>
            <Link
              href={ADMIN_ROUTES.COUPONS}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t.admin.nav.coupons}
            </Link>
            <Link
              href={ADMIN_ROUTES.ANNOUNCEMENTS}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t.admin.nav.announcements}
            </Link>
            <Link
              href={ADMIN_ROUTES.FAQS}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t.admin.nav.faqs}
            </Link>
            <Link
              href={ADMIN_ROUTES.INQUIRIES}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t.admin.nav.inquiries}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{MOCK_ADMIN.email}</span>
          <form action={signOutAdmin}>
            <Button type="submit" variant="outline" size="sm">
              {t.admin.dashboard.signOutButton}
            </Button>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{props.children}</main>
    </div>
  );
}

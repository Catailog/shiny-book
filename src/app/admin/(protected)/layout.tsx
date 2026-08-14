import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { defaultLocale, locales } from '@/locales';

import { signOutAdmin } from './actions';

export default async function AdminLayout(props: LayoutProps<'/admin'>) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect(ADMIN_ROUTES.LOGIN);
  }

  const t = locales[defaultLocale];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
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
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{admin.email}</span>
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

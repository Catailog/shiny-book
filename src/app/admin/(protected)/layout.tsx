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
        <span className="text-sm text-muted-foreground">{admin.email}</span>
        <form action={signOutAdmin}>
          <Button type="submit" variant="outline" size="sm">
            {t.admin.dashboard.signOutButton}
          </Button>
        </form>
      </header>
      <main className="flex flex-1 flex-col">{props.children}</main>
    </div>
  );
}

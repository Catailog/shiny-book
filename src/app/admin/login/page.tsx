import { redirect } from 'next/navigation';

import { BookOpen } from 'lucide-react';

import { ROLE } from '@/constants/roles';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { getMockSessionRole } from '@/lib/mock/mock-session';
import { locales } from '@/locales';

import { AdminLoginForm } from './login-form';

export default async function AdminLoginPage() {
  const role = await getMockSessionRole();
  if (role === ROLE.ADMIN) {
    redirect(ADMIN_ROUTES.DASHBOARD);
  }

  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted">
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-110 flex-col gap-8 rounded-xl border border-border bg-card p-10 shadow-lg">
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen aria-hidden="true" className="size-6 text-foreground" />
              <span className="font-heading text-2xl font-bold text-foreground">Shiny Book</span>
            </div>
            <p className="text-sm text-muted-foreground">{t.admin.portalLabel}</p>
          </div>
          <AdminLoginForm />
        </div>
      </main>
    </div>
  );
}

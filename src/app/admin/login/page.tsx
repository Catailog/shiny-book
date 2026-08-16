import { redirect } from 'next/navigation';

import { ROLE } from '@/constants/roles';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getMockSessionRole } from '@/lib/mock/mock-session';
import { defaultLocale, locales } from '@/locales';

import { AdminLoginForm } from './login-form';

export default async function AdminLoginPage() {
  const role = await getMockSessionRole();
  if (role === ROLE.ADMIN) {
    redirect(ADMIN_ROUTES.DASHBOARD);
  }

  const t = locales[defaultLocale];

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.admin.login.title}</h1>
      <AdminLoginForm />
    </main>
  );
}

import { redirect } from 'next/navigation';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';

import { signOutAdmin } from './actions';
import { AdminSidebar } from './admin-sidebar';

export default async function AdminLayout(props: LayoutProps<'/admin'>) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect(ADMIN_ROUTES.LOGIN);
  }

  return (
    <div className="flex min-h-full flex-1">
      <AdminSidebar signOutAction={signOutAdmin} />
      <main className="flex flex-1 flex-col bg-background">{props.children}</main>
    </div>
  );
}

import { redirect } from 'next/navigation';

import { ROLE } from '@/constants/roles';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getMockSessionRole } from '@/lib/mock/mock-session';

import { signOutAdmin } from './actions';
import { AdminSidebar } from './admin-sidebar';

export default async function AdminLayout(props: LayoutProps<'/admin'>) {
  const role = await getMockSessionRole();
  if (role !== ROLE.ADMIN) {
    redirect(ADMIN_ROUTES.LOGIN);
  }

  return (
    <div className="flex min-h-full flex-1">
      <AdminSidebar signOutAction={signOutAdmin} />
      <main className="flex flex-1 flex-col bg-muted">{props.children}</main>
    </div>
  );
}

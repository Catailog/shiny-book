import { redirect } from 'next/navigation';

import { ROLE } from '@/constants/roles';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getMockSessionRole } from '@/lib/mock/mock-session';

import { MypageSidebar } from './mypage-sidebar';

export default async function MypageLayout(props: LayoutProps<'/mypage'>) {
  const role = await getMockSessionRole();
  if (role !== ROLE.CONSUMER) {
    redirect(CONSUMER_ROUTES.LOGIN);
  }

  return (
    <div className="flex flex-1">
      <MypageSidebar />
      <div className="flex flex-1 flex-col">{props.children}</div>
    </div>
  );
}

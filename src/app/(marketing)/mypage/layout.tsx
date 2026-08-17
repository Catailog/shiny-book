import { redirect } from 'next/navigation';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';

import { MypageSidebar } from './mypage-sidebar';

export default async function MypageLayout(props: LayoutProps<'/mypage'>) {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    redirect(CONSUMER_ROUTES.LOGIN);
  }

  const consumerName =
    typeof consumer.user_metadata.name === 'string' ? consumer.user_metadata.name : '';

  return (
    <div className="flex flex-1">
      <MypageSidebar consumerName={consumerName} consumerEmail={consumer.email ?? ''} />
      <div className="flex flex-1 flex-col">{props.children}</div>
    </div>
  );
}

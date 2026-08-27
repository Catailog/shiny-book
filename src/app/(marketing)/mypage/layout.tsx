import { redirect } from 'next/navigation';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getSignedFileUrl } from '@/lib/uploads/get-signed-file-url';

import { MypageSidebar } from './mypage-sidebar';

export default async function MypageLayout(props: LayoutProps<'/mypage'>) {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    redirect(`${CONSUMER_ROUTES.LOGIN}?redirectTo=${encodeURIComponent(CONSUMER_ROUTES.MYPAGE)}`);
  }

  const consumerName = consumer.displayName;
  const avatarPath =
    typeof consumer.user_metadata.avatarPath === 'string'
      ? consumer.user_metadata.avatarPath
      : null;
  const avatarUrl = avatarPath ? await getSignedFileUrl(avatarPath) : null;

  return (
    <div className="flex flex-1">
      <MypageSidebar
        consumerName={consumerName}
        consumerEmail={consumer.email ?? ''}
        avatarUrl={avatarUrl}
      />
      <div className="flex flex-1 flex-col">{props.children}</div>
    </div>
  );
}

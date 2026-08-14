import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { defaultLocale, locales } from '@/locales';

import { signOutConsumer } from './actions';

export default async function MypageLayout(props: LayoutProps<'/mypage'>) {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    redirect(CONSUMER_ROUTES.LOGIN);
  }

  const t = locales[defaultLocale];

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-sm text-muted-foreground">{consumer.email}</span>
        <form action={signOutConsumer}>
          <Button type="submit" variant="outline" size="sm">
            {t.consumer.mypage.signOutButton}
          </Button>
        </form>
      </header>
      <main className="flex flex-1 flex-col">{props.children}</main>
    </div>
  );
}

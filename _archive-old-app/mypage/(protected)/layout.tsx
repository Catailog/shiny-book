import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { cn } from '@/lib/utils';
import { defaultLocale, locales } from '@/locales';

import { signOutConsumer } from './actions';

const sidebarLinkClassName =
  'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground';

export default async function MypageLayout(props: LayoutProps<'/mypage'>) {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    redirect(CONSUMER_ROUTES.LOGIN);
  }

  const t = locales[defaultLocale];

  return (
    <SiteContainer className="flex flex-1 flex-col sm:flex-row">
      <aside className="flex flex-col gap-6 border-b border-border bg-card px-4 py-6 sm:w-60 sm:shrink-0 sm:border-r sm:border-b-0">
        <Button
          render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />}
          nativeButton={false}
          className="w-full"
        >
          {t.consumer.mypage.newOrderButton}
        </Button>
        <nav className="flex flex-col gap-1">
          <Link
            href={CONSUMER_ROUTES.MYPAGE}
            className={cn(sidebarLinkClassName, 'text-foreground')}
          >
            {t.consumer.mypage.orders.title}
          </Link>
          <Link href={CONSUMER_ROUTES.INQUIRIES} className={sidebarLinkClassName}>
            {t.consumer.mypage.inquiriesButton}
          </Link>
          <Link href={CONSUMER_ROUTES.ACCOUNT} className={sidebarLinkClassName}>
            {t.consumer.mypage.accountButton}
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          <span className="truncate text-xs text-muted-foreground">{consumer.email}</span>
          <form action={signOutConsumer}>
            <Button type="submit" variant="outline" size="sm" className="w-full">
              {t.consumer.mypage.signOutButton}
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex flex-1 flex-col bg-muted/30">{props.children}</main>
    </SiteContainer>
  );
}

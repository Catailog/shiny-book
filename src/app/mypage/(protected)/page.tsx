import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

export default function MypagePage() {
  const t = locales[defaultLocale];

  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.consumer.mypage.title}</h1>
      <Button render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />} className="w-fit">
        {t.consumer.mypage.newOrderButton}
      </Button>
    </div>
  );
}

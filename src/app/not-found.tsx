import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

export default async function NotFound() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <h1 className="text-2xl font-semibold text-foreground">{t.notFound.title}</h1>
      <p className="text-sm text-muted-foreground">{t.notFound.description}</p>
      <Button render={<Link href="/" />} nativeButton={false}>
        {t.notFound.backToHome}
      </Button>
    </main>
  );
}

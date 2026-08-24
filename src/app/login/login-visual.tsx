import Image from 'next/image';
import Link from 'next/link';

import { BookOpen } from 'lucide-react';

import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

export async function LoginVisual() {
  const locale = await getLocale();
  const t = locales[locale];
  const quote = t.consumer.login.quote;

  return (
    <div className="relative hidden flex-col justify-between overflow-hidden p-10 lg:flex lg:w-2/5 xl:w-1/2 xl:p-16">
      <Image
        src="/images/login/visual.png"
        alt=""
        fill
        sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 40vw, 0px"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-inverted/85" />
      <Link href="/" className="relative flex items-center gap-3 text-inverted-foreground">
        <BookOpen aria-hidden="true" strokeWidth={1.8} className="size-6" />
        <span className="font-heading text-2xl font-bold">Shiny Book</span>
      </Link>
      <div className="relative flex flex-col gap-5 text-inverted-foreground">
        <p className="font-heading text-4xl leading-tight font-normal">{`"${quote.text}"`}</p>
        <p className="text-base font-medium opacity-80">— {quote.author}</p>
      </div>
    </div>
  );
}

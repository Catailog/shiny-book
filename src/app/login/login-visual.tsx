import Image from 'next/image';
import Link from 'next/link';

import { BookOpen } from 'lucide-react';

import { defaultLocale, locales } from '@/locales';

export function LoginVisual() {
  const t = locales[defaultLocale];
  const quote = t.consumer.login.quote;

  return (
    <div className="relative hidden w-full flex-col justify-between overflow-hidden p-16 lg:flex">
      <Image
        src="/images/login/visual.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 50vw, 0px"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-primary/65" />
      <Link href="/" className="relative flex items-center gap-3 text-primary-foreground">
        <BookOpen aria-hidden="true" strokeWidth={1.8} className="size-6" />
        <span className="font-heading text-2xl font-bold">Shiny Book</span>
      </Link>
      <div className="relative flex flex-col gap-5 text-primary-foreground">
        <p className="font-heading text-4xl leading-tight font-normal">{`"${quote.text}"`}</p>
        <p className="text-base font-medium opacity-80">— {quote.author}</p>
      </div>
    </div>
  );
}

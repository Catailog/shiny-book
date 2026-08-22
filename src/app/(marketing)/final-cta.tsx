import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { TextAnimate } from '@/components/ui/text-animate';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

export async function FinalCta() {
  const locale = await getLocale();
  const t = locales[locale];
  const cta = t.site.home.cta;

  return (
    <section className="relative w-full overflow-hidden">
      <Image src="/images/cta/bottom-cta.png" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-inverted/85" />
      <SiteContainer className="relative flex flex-col items-center gap-10 py-30 text-center">
        <div className="flex max-w-2xl flex-col items-center gap-4">
          <p className="text-[13px] font-semibold tracking-wide text-primary uppercase">
            {cta.eyebrow}
          </p>
          <TextAnimate
            as="h2"
            by="word"
            animation="slideUp"
            once
            className="font-heading text-4xl leading-tight font-normal text-balance break-keep text-inverted-foreground sm:text-5xl"
          >
            {cta.title}
          </TextAnimate>
          <div className="grid w-full">
            <p aria-hidden="true" className="invisible col-start-1 row-start-1 text-base">
              {cta.description}
            </p>
            <TypingAnimation
              as="p"
              duration={30}
              className="col-start-1 row-start-1 text-base font-normal tracking-normal text-inverted-foreground/80"
            >
              {cta.description}
            </TypingAnimation>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />}
            nativeButton={false}
            className="h-auto gap-2 rounded bg-primary px-7 py-3.5 text-xs font-semibold tracking-wide text-primary-foreground uppercase hover:bg-primary/90"
          >
            {cta.primaryLabel}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
          <Button
            render={<Link href={CONSUMER_ROUTES.INQUIRIES} />}
            nativeButton={false}
            variant="outline"
            className="h-auto rounded border-inverted-foreground bg-transparent px-7 py-3.5 text-xs font-semibold tracking-wide text-inverted-foreground uppercase hover:bg-inverted-foreground/10 hover:text-inverted-foreground"
          >
            {cta.secondaryLabel}
          </Button>
        </div>
      </SiteContainer>
    </section>
  );
}

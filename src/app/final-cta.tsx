import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

export function FinalCta() {
  const t = locales[defaultLocale];
  const cta = t.site.home.cta;

  return (
    <section className="relative w-full overflow-hidden">
      <Image src="/images/cta/bottom-cta.png" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-primary/85" />
      <SiteContainer className="relative flex flex-col items-center gap-10 py-30 text-center">
        <div className="flex max-w-2xl flex-col items-center gap-4">
          <p className="text-[13px] font-semibold tracking-wide text-accent uppercase">
            {cta.eyebrow}
          </p>
          <h2 className="font-heading text-4xl leading-tight font-normal text-primary-foreground sm:text-5xl">
            {cta.title}
          </h2>
          <p className="text-base text-primary-foreground/80">{cta.description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />}
            nativeButton={false}
            className="h-auto gap-2 rounded bg-accent px-7 py-3.5 text-xs font-semibold tracking-wide text-accent-foreground uppercase hover:bg-accent/90"
          >
            {cta.primaryLabel}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
          <Button
            render={<Link href={CONSUMER_ROUTES.INQUIRIES} />}
            nativeButton={false}
            variant="outline"
            className="h-auto rounded border-primary-foreground bg-transparent px-7 py-3.5 text-xs font-semibold tracking-wide text-primary-foreground uppercase hover:bg-primary-foreground/10"
          >
            {cta.secondaryLabel}
          </Button>
        </div>
      </SiteContainer>
    </section>
  );
}

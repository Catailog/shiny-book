import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { defaultLocale, locales } from '@/locales';

export function FinalCta() {
  const t = locales[defaultLocale];
  const copy = t.site.home.cta;

  return (
    <section className="relative w-full overflow-hidden bg-primary">
      <Image
        src="/images/cta/bottom-cta.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-primary/85" />
      <SiteContainer className="relative flex flex-col items-center gap-6 py-20 text-center lg:py-28">
        <span className="text-accent text-xs font-semibold tracking-wide uppercase">
          {copy.eyebrow}
        </span>
        <h2 className="font-heading text-3xl font-medium text-primary-foreground sm:text-4xl">
          {copy.title}
        </h2>
        <p className="max-w-lg text-primary-foreground/80">{copy.description}</p>
        <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
          <Button
            render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />}
            nativeButton={false}
            className="bg-accent text-accent-foreground hover:bg-accent/90 h-auto gap-2 rounded px-7 py-3.5"
          >
            {copy.primaryLabel}
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button
            render={<Link href={CONSUMER_ROUTES.INQUIRIES} />}
            nativeButton={false}
            variant="outline"
            className="h-auto rounded border-primary-foreground/30 bg-transparent px-7 py-3.5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            {copy.secondaryLabel}
          </Button>
        </div>
      </SiteContainer>
    </section>
  );
}

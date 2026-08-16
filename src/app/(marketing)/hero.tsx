import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { PageSection } from '@/components/page-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PREMIUM_PRODUCT_COUNT } from '@/constants/product-catalog';
import { CONSUMER_ROUTES, PRODUCT_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

interface HeroProps {
  soldBookCount: number;
}

export async function Hero({ soldBookCount }: HeroProps) {
  const locale = await getLocale();
  const t = locales[locale];
  const hero = t.site.home.hero;
  const statValues = [100, PREMIUM_PRODUCT_COUNT, soldBookCount];

  return (
    <PageSection
      sectionClassName="bg-background"
      className="flex flex-col items-center gap-16 py-14 sm:py-20 lg:flex-row lg:py-24"
    >
      <div className="flex flex-1 flex-col items-start gap-10">
        <div className="flex w-full flex-col items-start gap-4">
          <Badge className="rounded bg-primary-soft px-3 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
            {hero.eyebrow}
          </Badge>
          <h1 className="w-full font-heading text-4xl leading-tight font-normal text-foreground sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="w-full text-lg text-muted-foreground">{hero.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />}
            nativeButton={false}
            className="h-auto gap-2 rounded bg-primary px-7 py-3.5 text-xs font-semibold tracking-wide text-primary-foreground uppercase hover:bg-primary/90"
          >
            {hero.primaryCtaLabel}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Button>
          <Button
            render={<Link href={PRODUCT_ROUTES.LIST} />}
            nativeButton={false}
            variant="outline"
            className="h-auto rounded border-foreground bg-transparent px-7 py-3.5 text-xs font-semibold tracking-wide text-foreground uppercase hover:bg-muted"
          >
            {hero.secondaryCtaLabel}
          </Button>
        </div>
        <dl className="flex w-full flex-wrap gap-x-8 gap-y-5 border-t border-border pt-6">
          {hero.stats.map((stat, index) => (
            <div key={stat.label} className="flex flex-col items-start gap-1">
              <dt className="font-heading text-3xl font-bold text-foreground">
                {statValues[index]?.toLocaleString()}
                {stat.suffix}
              </dt>
              <dd className="text-xs text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative aspect-7/8 w-full shrink-0 overflow-hidden rounded-xl border border-border bg-secondary shadow-lg lg:w-135">
        <Image
          src="/images/hero/book-mockup.png"
          alt="완성된 책 목업 이미지"
          fill
          sizes="(min-width: 1024px) 540px, 100vw"
          className="object-cover"
          priority
        />
      </div>
    </PageSection>
  );
}

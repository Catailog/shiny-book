import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { PageSection } from '@/components/page-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Marquee } from '@/components/ui/marquee';
import { NumberTicker } from '@/components/ui/number-ticker';
import { TextAnimate } from '@/components/ui/text-animate';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { CONSUMER_ROUTES, PRODUCT_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

const HERO_MARQUEE_COLUMN_A = [
  '/images/gallery/forest-record.png',
  '/images/atelier/process-2.png',
  '/images/atelier/process-3.png',
  '/images/atelier/process-1.png',
  '/images/layout-guidelines/hero.png',
];

const HERO_MARQUEE_COLUMN_B = [
  '/images/gallery/afternoon-essay.png',
  '/images/gallery/first-steps.png',
  '/images/gallery/wedding-day.png',
  '/images/login/visual.png',
  '/images/press/hero.png',
];

interface HeroProps {
  soldBookCount: number;
  premiumProductCount: number;
}

export async function Hero({ soldBookCount, premiumProductCount }: HeroProps) {
  const locale = await getLocale();
  const t = locales[locale];
  const hero = t.site.home.hero;
  const statValues = [100, premiumProductCount, soldBookCount];

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
          <TextAnimate
            as="h1"
            by="word"
            animation="slideUp"
            once
            className="w-full font-heading text-4xl leading-tight font-normal text-balance text-foreground sm:text-5xl lg:text-6xl"
          >
            {hero.title}
          </TextAnimate>
          <div className="grid w-full">
            <p
              aria-hidden="true"
              className="invisible col-start-1 row-start-1 text-lg leading-relaxed font-normal tracking-normal"
            >
              {hero.description}
            </p>
            <TypingAnimation
              as="p"
              duration={30}
              className="col-start-1 row-start-1 text-lg leading-relaxed font-normal tracking-normal text-muted-foreground"
            >
              {hero.description}
            </TypingAnimation>
          </div>
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
                <NumberTicker value={statValues[index] ?? 0} />
                {stat.suffix}
              </dt>
              <dd className="text-xs text-muted-foreground">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="relative aspect-7/8 w-full shrink-0 lg:w-135">
        <div className="flex h-full w-full gap-2 p-2">
          <Marquee vertical pauseOnHover className="h-full flex-1 [--duration:28s] [--gap:0.5rem]">
            {HERO_MARQUEE_COLUMN_A.map((src) => (
              <div key={src} className="relative aspect-3/4 w-full overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="object-cover"
                />
              </div>
            ))}
          </Marquee>
          <Marquee
            vertical
            reverse
            pauseOnHover
            className="h-full flex-1 [--duration:28s] [--gap:0.5rem]"
          >
            {HERO_MARQUEE_COLUMN_B.map((src) => (
              <div key={src} className="relative aspect-3/4 w-full overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="object-cover"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </PageSection>
  );
}

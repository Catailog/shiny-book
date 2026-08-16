import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Leaf, Minimize2, Truck } from 'lucide-react';

import { PageSection } from '@/components/page-section';
import { Button } from '@/components/ui/button';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

const PILLAR_ICONS = [Leaf, Minimize2, Truck];

export default async function SustainabilityPage() {
  const locale = await getLocale();
  const t = locales[locale];
  const page = t.sustainability;

  return (
    <>
      <PageSection
        sectionClassName="bg-secondary"
        className="flex flex-col items-center gap-10 py-20 lg:flex-row"
      >
        <div className="flex flex-1 flex-col gap-5">
          <span className="w-fit rounded bg-primary-soft px-3 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
            {page.hero.eyebrow}
          </span>
          <h1 className="font-heading text-4xl leading-tight font-normal text-foreground sm:text-5xl">
            {page.hero.title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">{page.hero.description}</p>
        </div>
        <div className="relative h-80 w-full overflow-hidden rounded-lg border border-border bg-background lg:w-120">
          <Image
            src="/images/sustainability/hero.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </PageSection>

      <PageSection className="flex flex-col gap-12 py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {page.pillars.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-normal text-foreground">
            {page.pillars.title}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {page.pillars.items.map((pillar, index) => {
            const PillarIcon = PILLAR_ICONS[index];
            return (
              <div
                key={pillar.title}
                className="flex flex-col items-start gap-5 rounded-lg border border-border bg-secondary p-8"
              >
                <div className="flex size-10 items-center justify-center rounded bg-primary-soft">
                  {PillarIcon ? (
                    <PillarIcon aria-hidden="true" className="size-4 text-primary" />
                  ) : null}
                </div>
                <div className="flex flex-col items-start gap-2">
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                    {pillar.tag}
                  </p>
                  <p className="text-sm text-muted-foreground">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </PageSection>

      <PageSection sectionClassName="bg-secondary" className="flex flex-col gap-12 py-20">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {page.roadmap.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-normal text-foreground">
            {page.roadmap.title}
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          {page.roadmap.items.map((milestone) => (
            <div
              key={milestone.year}
              className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:gap-8"
            >
              <p className="w-35 shrink-0 font-heading text-4xl font-bold text-primary">
                {milestone.year}
              </p>
              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {milestone.title}
                </h3>
                <p className="text-[13px] text-muted-foreground">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        sectionClassName="bg-inverted"
        className="flex flex-col items-center gap-8 py-24 text-center"
      >
        <div className="flex max-w-2xl flex-col items-center gap-4">
          <p className="text-[13px] font-semibold tracking-wide text-primary uppercase">
            {page.cta.eyebrow}
          </p>
          <h2 className="font-heading text-4xl leading-tight font-normal text-inverted-foreground sm:text-5xl">
            {page.cta.title}
          </h2>
          <p className="text-base text-inverted-foreground/80">{page.cta.description}</p>
        </div>
        <Button
          render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />}
          nativeButton={false}
          className="h-auto gap-2 rounded bg-primary px-7 py-3.5 text-xs font-semibold tracking-wide text-primary-foreground uppercase hover:bg-primary/90"
        >
          {page.cta.buttonLabel}
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Button>
      </PageSection>
    </>
  );
}

import Image from 'next/image';
import Link from 'next/link';

import { Gift } from 'lucide-react';

import { PageSection } from '@/components/page-section';
import { Button } from '@/components/ui/button';
import { MARKETING_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

export default async function ShippingPolicyPage() {
  const locale = await getLocale();
  const t = locales[locale];
  const page = t.shippingPolicy;

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
            src="/images/shipping-policy/hero.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </PageSection>

      <PageSection className="flex flex-col items-start gap-6 py-20">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {page.methods.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-normal text-foreground">
            {page.methods.title}
          </h2>
        </div>
        <Button
          render={<Link href={MARKETING_ROUTES.PRICING} />}
          nativeButton={false}
          variant="primary"
          className="h-auto w-fit p-4 text-sm font-semibold uppercase"
        >
          {page.viewPricingButton}
        </Button>
      </PageSection>

      <PageSection sectionClassName="bg-secondary" className="flex flex-col gap-8 py-20">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {page.packaging.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-normal text-foreground">
            {page.packaging.title}
          </h2>
        </div>
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <h3 className="font-heading text-2xl font-normal text-foreground">
              {page.packaging.subtitle}
            </h3>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {page.packaging.description}
            </p>
            <div className="flex items-center gap-3">
              <Gift aria-hidden="true" className="size-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">{page.packaging.badgeLabel}</p>
            </div>
          </div>
          <div className="relative h-80 w-full overflow-hidden rounded-lg border border-border bg-background lg:w-150">
            <Image
              src="/images/shipping-policy/box.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </PageSection>

      <PageSection className="flex flex-col gap-4 py-20">
        <h2 className="font-heading text-2xl font-normal text-foreground">{page.returns.title}</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {page.returns.description}
        </p>
      </PageSection>
    </>
  );
}

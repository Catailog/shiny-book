import Image from 'next/image';
import Link from 'next/link';

import { Check } from 'lucide-react';

import { PageSection } from '@/components/page-section';
import { Button } from '@/components/ui/button';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

export default async function PricingPage() {
  const locale = await getLocale();
  const t = locales[locale];
  const pricing = t.pricing;

  return (
    <>
      <PageSection sectionClassName="bg-secondary" className="flex flex-col gap-5 pt-20 pb-15">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            {pricing.hero.eyebrow}
          </p>
          <h1 className="font-heading text-5xl font-bold text-foreground">{pricing.hero.title}</h1>
          <p className="text-base text-muted-foreground">{pricing.hero.description}</p>
        </div>
      </PageSection>

      <PageSection className="py-15">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {pricing.tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col gap-8 rounded-lg border border-border p-10"
            >
              <div className="flex flex-col gap-4">
                <h2 className="font-heading text-2xl font-bold text-foreground">{tier.name}</h2>
                <div className="relative h-50 w-full overflow-hidden rounded">
                  <Image
                    src={tier.image}
                    alt={tier.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="font-heading text-4xl font-bold text-primary">{tier.price}</p>
              </div>
              <div className="h-px w-full bg-border" />
              <ul className="flex flex-col gap-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <Check aria-hidden="true" className="size-4 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />}
                nativeButton={false}
                className="h-auto rounded bg-ink p-4 text-sm font-semibold text-ink-foreground uppercase transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {pricing.ctaLabel}
              </Button>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection className="py-15">
        <div className="flex flex-col gap-8">
          <h2 className="font-heading text-3xl font-bold text-foreground">{pricing.specsTitle}</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-175 border-collapse text-sm">
              <thead>
                <tr className="bg-ink text-ink-foreground">
                  <th className="p-5 text-left font-bold">{pricing.specsCategoryLabel}</th>
                  {pricing.tiers.map((tier) => (
                    <th key={tier.name} className="p-5 text-center font-bold">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricing.specRows.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="p-5 font-semibold text-foreground">{row.label}</td>
                    {row.values.map((value, index) => (
                      <td key={index} className="p-5 text-center text-muted-foreground">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageSection>

      <PageSection className="pt-15 pb-25">
        <div className="flex flex-col gap-5 rounded-lg border border-border bg-primary-soft p-10">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {pricing.volumeDiscount.title}
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            {pricing.volumeDiscount.description}
          </p>
          <div className="flex flex-wrap gap-8">
            {pricing.volumeDiscount.tiers.map((tier) => (
              <div key={tier.range} className="flex flex-col gap-1">
                <p className="font-heading text-xl font-bold text-primary">{tier.range}</p>
                <p className="text-[13px] text-muted-foreground">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>
      </PageSection>
    </>
  );
}

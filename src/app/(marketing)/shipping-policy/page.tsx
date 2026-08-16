import Image from 'next/image';

import { Gift } from 'lucide-react';

import { PageSection } from '@/components/page-section';
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

      <PageSection className="flex flex-col gap-8 py-20">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {page.methods.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-normal text-foreground">
            {page.methods.title}
          </h2>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-175 border-collapse text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="p-5 text-left font-bold text-foreground">
                  {page.methods.headers.method}
                </th>
                <th className="p-5 text-left font-bold text-foreground">
                  {page.methods.headers.duration}
                </th>
                <th className="p-5 text-left font-bold text-foreground">
                  {page.methods.headers.cost}
                </th>
                <th className="p-5 text-left font-bold text-foreground">
                  {page.methods.headers.coverage}
                </th>
              </tr>
            </thead>
            <tbody>
              {page.methods.items.map((item) => (
                <tr key={item.method} className="border-t border-border">
                  <td className="p-5 font-semibold text-foreground">{item.method}</td>
                  <td className="p-5 text-muted-foreground">{item.duration}</td>
                  <td className="p-5 font-semibold text-primary">{item.cost}</td>
                  <td className="p-5 text-muted-foreground">{item.coverage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

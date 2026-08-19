import Link from 'next/link';

import { PageSection } from '@/components/page-section';
import { Button } from '@/components/ui/button';
import { PRICING, SHIPPING } from '@/constants/pricing';
import { CONSUMER_ROUTES, PRODUCT_ROUTES } from '@/constants/routes';
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
        <div className="flex flex-col gap-6 rounded-lg border border-border p-10">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {pricing.pagePricing.title}
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {pricing.pagePricing.description}
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-6">
            <span className="text-base font-semibold text-foreground">
              {pricing.pagePricing.perPageLine}
            </span>
            <span className="font-heading text-2xl font-bold text-primary">
              ₩{PRICING.PRICE_PER_PAGE_KRW.toLocaleString()}
            </span>
          </div>
          <Link
            href={PRODUCT_ROUTES.LIST}
            className="w-fit text-sm font-semibold text-primary underline"
          >
            {pricing.pagePricing.productLinkLabel}
          </Link>
        </div>
      </PageSection>

      <PageSection className="flex flex-col gap-6 pb-15">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          {pricing.shippingPricing.title}
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="p-5 text-left font-bold text-foreground">
                  {pricing.shippingPricing.tableHeaders.item}
                </th>
                <th className="p-5 text-left font-bold text-foreground">
                  {pricing.shippingPricing.tableHeaders.amount}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="p-5 font-semibold text-foreground">
                  {pricing.shippingPricing.baseFeeLine}
                </td>
                <td className="p-5 text-primary">₩{SHIPPING.BASE_FEE_KRW.toLocaleString()}</td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-5 font-semibold text-foreground">
                  {pricing.shippingPricing.jejuLine}
                </td>
                <td className="p-5 text-primary">
                  +₩{SHIPPING.JEJU_SURCHARGE_KRW.toLocaleString()}
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-5 font-semibold text-foreground">
                  {pricing.shippingPricing.remoteLine}
                </td>
                <td className="p-5 text-primary">
                  +₩{SHIPPING.REMOTE_AREA_SURCHARGE_KRW.toLocaleString()}
                </td>
              </tr>
              <tr className="border-t border-border">
                <td className="p-5 font-semibold text-foreground">
                  {pricing.shippingPricing.freeThresholdLine.replace(
                    '{amount}',
                    `₩${SHIPPING.FREE_SHIPPING_THRESHOLD_KRW.toLocaleString()}`,
                  )}
                </td>
                <td className="p-5 font-semibold text-primary">
                  {pricing.shippingPricing.freeThresholdValue}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection className="pb-25">
        <div className="flex justify-center">
          <Button
            render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />}
            nativeButton={false}
            variant="primary"
            className="h-auto p-4 text-sm font-semibold uppercase"
          >
            {pricing.ctaLabel}
          </Button>
        </div>
      </PageSection>
    </>
  );
}

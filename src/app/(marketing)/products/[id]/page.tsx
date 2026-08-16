import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowRight, FileText, LayoutGrid, ScrollText } from 'lucide-react';

import { PageSection } from '@/components/page-section';
import { Button } from '@/components/ui/button';
import { CONSUMER_ROUTES, PRODUCT_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { getProductCatalog } from '@/lib/products/get-product-catalog';
import { locales } from '@/locales';

const SPEC_ICONS = [FileText, ScrollText, LayoutGrid];

export default async function ProductDetailPage(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params;
  const catalog = getProductCatalog();
  const product = catalog.find((item) => item.slug === id);

  if (!product) {
    notFound();
  }

  const locale = await getLocale();
  const t = locales[locale];
  const products = t.site.home.products;
  const detail = t.products.detail;
  const relatedProducts = catalog.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <>
      <PageSection className="flex flex-col gap-10 py-16 lg:flex-row lg:py-20">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-secondary lg:flex-1">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex w-full flex-col gap-8 lg:w-135">
          <div className="flex flex-col gap-4">
            <span className="w-fit rounded bg-primary-soft px-2.5 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              {products.filters[product.category]}
            </span>
            <div className="flex items-baseline justify-between gap-3">
              <h1 className="font-heading text-4xl font-bold text-foreground">{product.name}</h1>
              <p className="text-sm font-semibold text-muted-foreground">{product.size}</p>
            </div>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <p className="font-heading text-3xl font-bold text-primary">{product.price}</p>
          </div>
          <div className="h-px w-full bg-border" />
          <div className="flex flex-col gap-3">
            <Button
              render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />}
              nativeButton={false}
              className="h-auto gap-2 rounded bg-primary p-4.5 text-sm font-bold text-primary-foreground uppercase hover:bg-primary/90"
            >
              {detail.ctaLabel}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
            <Link
              href={PRODUCT_ROUTES.LIST}
              className="text-center text-sm font-medium text-muted-foreground underline"
            >
              {detail.backToList}
            </Link>
          </div>
        </div>
      </PageSection>
      <PageSection
        sectionClassName="bg-secondary"
        className="flex flex-col items-center gap-16 py-24"
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {detail.specsEyebrow}
          </p>
          <h2 className="font-heading text-4xl font-normal text-foreground">{detail.specsTitle}</h2>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {detail.specs.map((spec, index) => {
            const SpecIcon = SPEC_ICONS[index];
            return (
              <div
                key={spec.title}
                className="flex flex-col items-start gap-5 rounded-lg border border-border bg-background p-8"
              >
                {SpecIcon ? <SpecIcon aria-hidden="true" className="size-10 text-primary" /> : null}
                <div className="flex flex-col items-start gap-2">
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {spec.title}
                  </h3>
                  <p className="text-[13px] text-muted-foreground">{spec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </PageSection>
      <PageSection className="flex flex-col gap-12 py-24">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            {detail.relatedEyebrow}
          </p>
          <h2 className="font-heading text-3xl font-normal text-foreground">
            {detail.relatedTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {relatedProducts.map((related) => (
            <Link
              key={related.slug}
              href={`${PRODUCT_ROUTES.LIST}/${related.slug}`}
              className="group flex flex-col gap-4 overflow-hidden rounded-lg border border-border"
            >
              <div className="relative h-60 w-full">
                <Image
                  src={related.image}
                  alt={related.name}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-3 px-5 pb-5">
                <p className="font-heading text-xl font-semibold text-foreground">{related.name}</p>
                <p className="text-sm font-bold text-primary">{related.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </PageSection>
    </>
  );
}

import { PageSection } from '@/components/page-section';
import { HOME_SECTION_ANCHORS } from '@/constants/home-sections';
import { getLocale } from '@/lib/i18n/get-locale';
import { getProductCatalog } from '@/lib/products/get-product-catalog';
import { locales } from '@/locales';

import { ProductFilterGrid } from './product-filter-grid';

export async function ProductShowcase() {
  const locale = await getLocale();
  const t = locales[locale];
  const products = t.site.home.products;
  const items = getProductCatalog();

  return (
    <PageSection
      id={HOME_SECTION_ANCHORS.PRODUCT_COLLECTION}
      sectionClassName="bg-background"
      className="flex flex-col gap-16 py-24"
    >
      <div className="flex flex-col items-start gap-4">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
          {products.eyebrow}
        </p>
        <h2 className="font-heading text-4xl font-normal text-foreground">{products.title}</h2>
      </div>
      <ProductFilterGrid
        items={items}
        filters={products.filters}
        startingFromLabel={products.startingFromLabel}
        ctaLabel={products.ctaLabel}
        filterLabel={products.filterLabel}
      />
    </PageSection>
  );
}

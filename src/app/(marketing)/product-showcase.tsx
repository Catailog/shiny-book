import { SiteContainer } from '@/components/site-container';
import { HOME_SECTION_ANCHORS } from '@/constants/home-sections';
import { getProductCatalog } from '@/lib/products/get-product-catalog';
import { defaultLocale, locales } from '@/locales';

import { ProductFilterGrid } from './product-filter-grid';

export function ProductShowcase() {
  const t = locales[defaultLocale];
  const products = t.site.home.products;
  const items = getProductCatalog();

  return (
    <section id={HOME_SECTION_ANCHORS.PRODUCT_COLLECTION} className="w-full bg-background">
      <SiteContainer className="flex flex-col gap-16 py-24">
        <div className="flex flex-col items-start gap-4">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">
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
      </SiteContainer>
    </section>
  );
}

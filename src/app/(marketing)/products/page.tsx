import { PageSection } from '@/components/page-section';
import { getProductCatalog } from '@/lib/products/get-product-catalog';
import { defaultLocale, locales } from '@/locales';

import { ProductCatalog } from './product-catalog';

export default function ProductsPage() {
  const t = locales[defaultLocale];
  const products = t.site.home.products;
  const page = t.products;
  const items = getProductCatalog();

  return (
    <>
      <PageSection sectionClassName="bg-secondary" className="pt-20 pb-15">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            {page.hero.eyebrow}
          </p>
          <h1 className="font-heading text-5xl font-bold text-foreground">{page.hero.title}</h1>
          <p className="text-base text-muted-foreground">{page.hero.description}</p>
        </div>
      </PageSection>
      <PageSection className="py-15">
        <ProductCatalog
          items={items}
          filters={products.filters}
          resultsLabel={page.resultsLabel}
          viewDetailsLabel={page.viewDetails}
          startingFromLabel={products.startingFromLabel}
        />
      </PageSection>
    </>
  );
}

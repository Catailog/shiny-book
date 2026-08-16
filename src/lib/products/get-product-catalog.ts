import { PRODUCT_CATALOG, type ProductCategory } from '@/constants/product-catalog';
import { defaultLocale, locales } from '@/locales';

export interface CatalogProduct {
  slug: string;
  image: string;
  category: ProductCategory;
  name: string;
  size: string;
  description: string;
  price: string;
}

export function getProductCatalog(): CatalogProduct[] {
  const t = locales[defaultLocale];
  const items = t.site.home.products.items;

  return PRODUCT_CATALOG.map((product, index) => {
    const copy = items[index];
    return copy ? { ...product, ...copy } : null;
  }).filter((item): item is NonNullable<typeof item> => item !== null);
}

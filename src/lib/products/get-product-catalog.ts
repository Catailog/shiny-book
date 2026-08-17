import {
  PRODUCT_CATEGORY,
  type ProductCategory,
  isProductCategory,
} from '@/constants/product-category';
import type { Locale } from '@/locales';

import { getProducts } from './get-products';
import { resolveProductName } from './resolve-product-name';

export interface CatalogProduct {
  slug: string;
  image: string;
  category: ProductCategory;
  name: string;
  size: string;
  description: string;
  price: string;
}

export async function getProductCatalog(locale: Locale): Promise<CatalogProduct[]> {
  const products = await getProducts();

  return products.map((product) => ({
    slug: product.slug,
    image: product.image_url,
    category: isProductCategory(product.category) ? product.category : PRODUCT_CATEGORY.CLASSIC,
    name: resolveProductName(product, locale),
    size: product.size,
    description: product.description,
    price: `₩${product.price.toLocaleString()}`,
  }));
}

import {
  PRODUCT_CATEGORY,
  type ProductCategory,
  isProductCategory,
} from '@/constants/product-category';

import { getProducts } from './get-products';

export interface CatalogProduct {
  slug: string;
  image: string;
  category: ProductCategory;
  name: string;
  size: string;
  description: string;
  price: string;
}

export async function getProductCatalog(): Promise<CatalogProduct[]> {
  const products = await getProducts();

  return products.map((product) => ({
    slug: product.slug,
    image: product.image_url,
    category: isProductCategory(product.category) ? product.category : PRODUCT_CATEGORY.CLASSIC,
    name: product.name,
    size: product.size,
    description: product.description,
    price: `₩${product.price.toLocaleString()}`,
  }));
}

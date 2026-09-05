import type { CatalogProduct } from '@/lib/products/get-product-catalog';
import type { locales } from '@/locales';

// Shared by collect-knowledge-chunks.ts (vector search) and build-knowledge-base.ts
// (full-context fallback) so a product's text representation never drifts between
// the two paths. The category is labeled and translated via the same locale
// strings the admin product form uses (t.admin.products.*) - previously this
// inserted the raw 'classic'/'premium' enum value unlabeled, which the assistant
// couldn't reliably read as a groupable category when asked to compare or
// aggregate across a product tier.
export function formatProductChunk(
  product: CatalogProduct,
  t: (typeof locales)[keyof typeof locales],
): string {
  const categoryLabel = t.admin.products.categoryOptions[product.category];
  return `[${product.name}] ${product.price}, ${product.size}\n${t.admin.products.form.categoryLabel}: ${categoryLabel}\n${product.description}`;
}

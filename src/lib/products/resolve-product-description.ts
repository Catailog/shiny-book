import type { Tables } from '@/lib/db/database.types';
import type { Locale } from '@/locales';

export function resolveProductDescription(
  product: Pick<Tables<'products'>, 'description' | 'description_en'>,
  locale: Locale,
): string {
  if (locale === 'en' && product.description_en) {
    return product.description_en;
  }

  return product.description;
}

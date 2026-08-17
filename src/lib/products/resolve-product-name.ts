import type { Tables } from '@/lib/db/database.types';
import type { Locale } from '@/locales';

export function resolveProductName(
  product: Pick<Tables<'products'>, 'name' | 'name_en'>,
  locale: Locale,
): string {
  if (locale === 'en' && product.name_en) {
    return product.name_en;
  }

  return product.name;
}

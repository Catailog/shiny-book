export const PRODUCT_CATALOG = [
  {
    slug: 'hardcover-photobook',
    image: '/images/products/hardcover-photobook.png',
    category: 'classic',
  },
  {
    slug: 'softcover-photobook',
    image: '/images/products/softcover-photobook.png',
    category: 'classic',
  },
  {
    slug: 'premium-photo-album',
    image: '/images/products/premium-photo-album.png',
    category: 'premium',
  },
  { slug: 'travel-journal', image: '/images/products/travel-journal.png', category: 'classic' },
  { slug: 'wedding-album', image: '/images/products/wedding-album.png', category: 'premium' },
  { slug: 'babys-first-year', image: '/images/products/babys-first-year.png', category: 'premium' },
] as const;

export type ProductCategory = (typeof PRODUCT_CATALOG)[number]['category'];

export const PREMIUM_PRODUCT_COUNT = PRODUCT_CATALOG.filter(
  (product) => product.category === 'premium',
).length;

import { PRODUCT_CATEGORY } from '@/constants/product-category';
import { HOME_REVIEW_PREVIEW_LIMIT } from '@/constants/review';
import { MOCK_REVIEWS } from '@/lib/mock/mock-reviews';
import { getSoldBookCount } from '@/lib/orders/get-sold-book-count';
import { getProducts } from '@/lib/products/get-products';
import { getReviews } from '@/lib/reviews/get-reviews';

import { FinalCta } from './final-cta';
import { Hero } from './hero';
import { ProcessSteps } from './process-steps';
import { ProductShowcase } from './product-showcase';
import { QualityFeatures } from './quality-features';
import { Testimonials } from './testimonials';

export default async function Home() {
  const [reviews, soldBookCount, products] = await Promise.all([
    getReviews(HOME_REVIEW_PREVIEW_LIMIT),
    getSoldBookCount(),
    getProducts(),
  ]);
  const premiumProductCount = products.filter(
    (product) => product.category === PRODUCT_CATEGORY.PREMIUM,
  ).length;

  return (
    <>
      <Hero soldBookCount={soldBookCount} premiumProductCount={premiumProductCount} />
      <ProcessSteps />
      <ProductShowcase />
      <QualityFeatures />
      <Testimonials reviews={reviews.length > 0 ? reviews : MOCK_REVIEWS} />
      <FinalCta />
    </>
  );
}

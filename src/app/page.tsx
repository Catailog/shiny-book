import { HOME_REVIEW_PREVIEW_LIMIT } from '@/constants/review';
import { getSoldBookCount } from '@/lib/orders/get-sold-book-count';
import { getReviews } from '@/lib/reviews/get-reviews';

import { FinalCta } from './final-cta';
import { Footer } from './footer';
import { Hero } from './hero';
import { Nav } from './nav';
import { ProcessSteps } from './process-steps';
import { ProductShowcase } from './product-showcase';
import { QualityFeatures } from './quality-features';
import { Testimonials } from './testimonials';

export default async function Home() {
  const [reviews, soldBookCount] = await Promise.all([
    getReviews(HOME_REVIEW_PREVIEW_LIMIT),
    getSoldBookCount(),
  ]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero soldBookCount={soldBookCount} />
        <ProcessSteps />
        <ProductShowcase />
        <QualityFeatures />
        <Testimonials reviews={reviews} />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

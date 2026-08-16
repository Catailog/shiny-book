import { HOME_NOTICE_PREVIEW_LIMIT } from '@/constants/announcement';
import { HOME_REVIEW_PREVIEW_LIMIT } from '@/constants/review';
import { getAnnouncements } from '@/lib/announcements/get-announcements';
import { getSoldBookCount } from '@/lib/orders/get-sold-book-count';
import { getReviews } from '@/lib/reviews/get-reviews';

import { FinalCta } from './final-cta';
import { Hero } from './hero';
import { NoticeTicker } from './notice-ticker';
import { ProcessSteps } from './process-steps';
import { ProductCards } from './product-cards';
import { QualityFeatures } from './quality-features';
import { Testimonials } from './testimonials';

export default async function Home() {
  const [notices, reviews, soldBookCount] = await Promise.all([
    getAnnouncements(HOME_NOTICE_PREVIEW_LIMIT),
    getReviews(HOME_REVIEW_PREVIEW_LIMIT),
    getSoldBookCount(),
  ]);

  return (
    <>
      <Hero soldBookCount={soldBookCount} />
      <NoticeTicker notices={notices} />
      <ProcessSteps />
      <ProductCards />
      <QualityFeatures />
      <Testimonials reviews={reviews} />
      <FinalCta />
    </>
  );
}

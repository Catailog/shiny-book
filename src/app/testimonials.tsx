import { Star } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { REVIEW_RATING_MAX } from '@/constants/review';
import type { ReviewWithOrderTitle } from '@/lib/reviews/get-reviews';
import { defaultLocale, locales } from '@/locales';

interface TestimonialsProps {
  reviews: ReviewWithOrderTitle[];
}

export function Testimonials({ reviews }: TestimonialsProps) {
  const t = locales[defaultLocale];
  const copy = t.site.home.reviews;

  return (
    <section className="w-full bg-background">
      <SiteContainer className="flex flex-col items-center gap-16 py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">
            {copy.eyebrow}
          </p>
          <h2 className="font-heading text-4xl font-normal text-foreground">{copy.title}</h2>
        </div>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">{copy.empty}</p>
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="sm:basis-1/2 lg:basis-1/3">
                  <div className="flex h-full flex-col items-start gap-6 rounded-lg border border-border bg-secondary p-9">
                    <div aria-label={copy.ratingLabel} className="flex items-start gap-1">
                      {Array.from({ length: REVIEW_RATING_MAX }).map((_, index) => (
                        <Star
                          key={index}
                          aria-hidden="true"
                          className={
                            index < review.rating
                              ? 'size-4 fill-accent text-accent'
                              : 'size-4 text-border'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-[15px] leading-relaxed text-foreground">{review.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {copy.purchasedLabel}: {review.orderTitle}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious aria-label={copy.prevLabel} />
            <CarouselNext aria-label={copy.nextLabel} />
          </Carousel>
        )}
      </SiteContainer>
    </section>
  );
}

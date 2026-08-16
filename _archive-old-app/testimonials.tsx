'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Quote, Star } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '@/components/ui/carousel';
import { REVIEW_RATING_MAX } from '@/constants/review';
import { REVIEW_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';
import type { ReviewWithOrderTitle } from '@/lib/reviews/get-reviews';
import { cn } from '@/lib/utils';

const AUTO_ADVANCE_INTERVAL_MS = 4000;

interface TestimonialsProps {
  reviews: ReviewWithOrderTitle[];
}

export function Testimonials({ reviews }: TestimonialsProps) {
  const t = useT();
  const copy = t.site.home.reviews;

  return (
    <SiteContainer className="flex flex-col gap-12 py-16 lg:py-24">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-accent text-xs font-semibold tracking-wide uppercase">
          {copy.eyebrow}
        </span>
        <h2 className="font-heading text-3xl font-medium text-foreground sm:text-4xl">
          {copy.title}
        </h2>
      </div>
      {reviews.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">{copy.empty}</p>
      ) : reviews.length === 1 ? (
        <div className="flex justify-center">
          <TestimonialCard
            review={reviews[0]!}
            purchasedLabel={copy.purchasedLabel}
            ratingLabel={copy.ratingLabel}
          />
        </div>
      ) : (
        <Carousel className="w-full" opts={{ loop: true, align: 'center' }}>
          <TestimonialsTrack reviews={reviews} copy={copy} />
        </Carousel>
      )}
      <Button
        render={<Link href={REVIEW_ROUTES.LIST} />}
        nativeButton={false}
        variant="outline"
        className="mx-auto h-auto rounded px-7 py-3.5"
      >
        {copy.more}
      </Button>
    </SiteContainer>
  );
}

interface TestimonialsTrackProps {
  reviews: ReviewWithOrderTitle[];
  copy: ReturnType<typeof useT>['site']['home']['reviews'];
}

function TestimonialsTrack({ reviews, copy }: TestimonialsTrackProps) {
  const { api } = useCarousel();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!api || isHovering) return;
    const id = setInterval(() => api.scrollNext(), AUTO_ADVANCE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [api, isHovering]);

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
        <CarouselContent className="-ml-6">
          {reviews.map((review) => (
            <CarouselItem key={review.id} className="basis-4/5 pl-6 sm:basis-1/2 lg:basis-1/3">
              <TestimonialCard
                review={review}
                purchasedLabel={copy.purchasedLabel}
                ratingLabel={copy.ratingLabel}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
      <CarouselPrevious
        aria-label={copy.prevLabel}
        className="left-2 opacity-0 transition-opacity group-hover/carousel:opacity-100"
      />
      <CarouselNext
        aria-label={copy.nextLabel}
        className="right-2 opacity-0 transition-opacity group-hover/carousel:opacity-100"
      />
    </div>
  );
}

interface TestimonialCardProps {
  review: ReviewWithOrderTitle;
  purchasedLabel: string;
  ratingLabel: string;
}

function TestimonialCard({ review, purchasedLabel, ratingLabel }: TestimonialCardProps) {
  return (
    <Link href={`${REVIEW_ROUTES.LIST}#review-${review.id}`} className="block h-full">
      <Card className="h-full w-full max-w-80 rounded-lg border border-border bg-muted shadow-none ring-0 transition-shadow hover:shadow-lg">
        <CardContent className="flex h-full flex-col gap-6 p-7 sm:p-9">
          <Quote aria-hidden="true" className="fill-accent text-accent size-5" />
          <blockquote className="line-clamp-4 flex-1 text-sm leading-relaxed text-foreground">
            &ldquo;{review.content}&rdquo;
          </blockquote>
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <div
              className="flex items-center gap-0.5"
              role="img"
              aria-label={`${ratingLabel} ${review.rating} / ${REVIEW_RATING_MAX}`}
            >
              {Array.from({ length: REVIEW_RATING_MAX }, (_, index) => (
                <Star
                  key={index}
                  aria-hidden="true"
                  className={cn(
                    'size-3.5',
                    index < review.rating
                      ? 'fill-accent text-accent'
                      : 'fill-none text-muted-foreground/30',
                  )}
                />
              ))}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">{purchasedLabel}</span>
              <span className="text-sm font-medium text-foreground">{review.orderTitle}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

'use client';

import { Star } from 'lucide-react';

import { REVIEW_RATING_MAX, REVIEW_RATING_MIN } from '@/constants/review';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
}

export function StarRating({ value, onChange, readOnly = false, className }: StarRatingProps) {
  if (readOnly) {
    return (
      <div className={cn('flex items-center gap-0.5', className)}>
        {RATING_VALUES.map((rating) => (
          <Star
            key={rating}
            aria-hidden="true"
            className={cn(
              'size-4',
              rating <= value ? 'fill-primary text-primary' : 'fill-none text-primary',
            )}
          />
        ))}
        <span className="sr-only">{value} / 5</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)} role="radiogroup">
      {RATING_VALUES.map((rating) => (
        <button
          key={rating}
          type="button"
          role="radio"
          aria-checked={rating === value}
          aria-label={String(rating)}
          onClick={() => onChange?.(rating)}
          className="p-0.5"
        >
          <Star
            aria-hidden="true"
            className={cn(
              'size-5',
              rating <= value ? 'fill-primary text-primary' : 'fill-none text-primary',
            )}
          />
        </button>
      ))}
    </div>
  );
}

const RATING_VALUES = Array.from(
  { length: REVIEW_RATING_MAX - REVIEW_RATING_MIN + 1 },
  (_, index) => REVIEW_RATING_MIN + index,
);

'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REVIEW_RATING_MAX, REVIEW_RATING_MIN } from '@/constants/review';
import { useT } from '@/hooks/use-t';

import { createReview } from './actions';
import { type ReviewFormInput, reviewFormSchema } from './review-schema';

interface ReviewFormProps {
  orderId: string;
}

const RATING_OPTIONS = Array.from(
  { length: REVIEW_RATING_MAX - REVIEW_RATING_MIN + 1 },
  (_, index) => REVIEW_RATING_MIN + index,
);

export function ReviewForm({ orderId }: ReviewFormProps) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormInput>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { rating: REVIEW_RATING_MAX },
  });

  function onSubmit(values: ReviewFormInput) {
    startTransition(async () => {
      const result = await createReview(orderId, values);
      if (result) {
        toast.error(t.consumer.reviews.errors[result.errorCode]);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rating">{t.consumer.reviews.form.ratingLabel}</Label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <Select
              value={String(field.value)}
              onValueChange={(value) => field.onChange(Number(value))}
            >
              <SelectTrigger id="rating" className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RATING_OPTIONS.map((rating) => (
                  <SelectItem key={rating} value={String(rating)}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">{t.consumer.reviews.form.contentLabel}</Label>
        <textarea
          id="content"
          rows={6}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          {...register('content')}
        />
        {errors.content ? (
          <p className="text-sm text-destructive">{t.consumer.reviews.errors.validation_failed}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? t.consumer.reviews.form.submitting : t.consumer.reviews.form.submitButton}
      </Button>
    </form>
  );
}

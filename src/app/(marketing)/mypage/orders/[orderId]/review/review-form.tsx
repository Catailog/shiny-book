'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { StarRating } from '@/components/star-rating';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { REVIEW_RATING_MAX } from '@/constants/review';
import { useT } from '@/hooks/use-t';

import { createReview } from './actions';
import { type ReviewFormInput, reviewFormSchema } from './review-schema';

interface ReviewFormProps {
  orderId: string;
}

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
          render={({ field }) => <StarRating value={field.value} onChange={field.onChange} />}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">{t.consumer.reviews.form.contentLabel}</Label>
        <Textarea id="content" rows={6} {...register('content')} />
        {errors.content ? (
          <p className="text-sm text-destructive">{t.consumer.reviews.errors.validation_failed}</p>
        ) : null}
      </div>
      <Button type="submit" variant="primary" disabled={isPending} className="w-fit">
        {isPending ? t.consumer.reviews.form.submitting : t.consumer.reviews.form.submitButton}
      </Button>
    </form>
  );
}

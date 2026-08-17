'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';

import { createInquiry } from './actions';
import { type InquiryFormInput, inquiryFormSchema } from './inquiry-schema';

export function InquiryForm() {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFormInput>({ resolver: zodResolver(inquiryFormSchema) });

  function onSubmit(values: InquiryFormInput) {
    startTransition(async () => {
      const result = await createInquiry(values);
      if (result) {
        toast.error(t.consumer.inquiries.errors[result.errorCode]);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-3xl flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="inquiry-title">{t.consumer.inquiries.form.titleLabel}</Label>
        <Input
          id="inquiry-title"
          placeholder={t.consumer.inquiries.form.titlePlaceholder}
          {...register('title')}
        />
        {errors.title ? (
          <p className="text-sm text-destructive">
            {t.consumer.inquiries.errors.validation_failed}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="inquiry-content">{t.consumer.inquiries.form.contentLabel}</Label>
        <Textarea
          id="inquiry-content"
          rows={8}
          placeholder={t.consumer.inquiries.form.contentPlaceholder}
          {...register('content')}
        />
        {errors.content ? (
          <p className="text-sm text-destructive">
            {t.consumer.inquiries.errors.validation_failed}
          </p>
        ) : null}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          render={<Link href={CONSUMER_ROUTES.INQUIRIES} />}
          nativeButton={false}
        >
          {t.consumer.inquiries.form.cancelButton}
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isPending
            ? t.consumer.inquiries.form.submitting
            : t.consumer.inquiries.form.submitButton}
        </Button>
      </div>
    </form>
  );
}

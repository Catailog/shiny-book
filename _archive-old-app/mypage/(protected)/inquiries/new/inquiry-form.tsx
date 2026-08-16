'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">{t.consumer.inquiries.form.titleLabel}</Label>
        <Input id="title" type="text" {...register('title')} />
        {errors.title ? (
          <p className="text-sm text-destructive">
            {t.consumer.inquiries.errors.validation_failed}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">{t.consumer.inquiries.form.contentLabel}</Label>
        <textarea
          id="content"
          rows={6}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          {...register('content')}
        />
        {errors.content ? (
          <p className="text-sm text-destructive">
            {t.consumer.inquiries.errors.validation_failed}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? t.consumer.inquiries.form.submitting : t.consumer.inquiries.form.submitButton}
      </Button>
    </form>
  );
}

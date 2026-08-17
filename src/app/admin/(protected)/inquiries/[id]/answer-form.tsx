'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { defaultLocale, locales } from '@/locales';

import { answerInquiry } from '../actions';
import { type AnswerFormInput, answerFormSchema } from '../answer-schema';

interface AnswerInquiryFormProps {
  id: string;
  defaultAnswer: string;
}

export function AnswerInquiryForm({ id, defaultAnswer }: AnswerInquiryFormProps) {
  const t = locales[defaultLocale];
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnswerFormInput>({
    resolver: zodResolver(answerFormSchema),
    defaultValues: { answer: defaultAnswer },
  });

  function onSubmit(values: AnswerFormInput) {
    startTransition(async () => {
      const result = await answerInquiry(id, values);
      if (result) {
        toast.error(t.admin.inquiries.errors[result.errorCode]);
        return;
      }

      toast.success(t.admin.inquiries.answerSuccess);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <textarea
        rows={6}
        className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        {...register('answer')}
      />
      {errors.answer ? (
        <p className="text-sm text-destructive">{t.admin.inquiries.errors.validation_failed}</p>
      ) : null}
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? t.admin.inquiries.answering : t.admin.inquiries.answerButton}
      </Button>
    </form>
  );
}

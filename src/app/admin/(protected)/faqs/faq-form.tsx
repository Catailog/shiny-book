'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FAQ_ANSWER_MAX_LENGTH, FAQ_QUESTION_MAX_LENGTH } from '@/constants/faq';
import { fieldErrorMessage } from '@/lib/forms/field-error-message';
import { defaultLocale, locales } from '@/locales';

import type { FaqActionResult } from './actions';
import { type FaqFormInput, faqFormSchema } from './faq-schema';

interface FaqFormProps {
  defaultValues?: FaqFormInput;
  action: (values: FaqFormInput) => Promise<FaqActionResult | undefined>;
  submitLabel: string;
  submittingLabel: string;
  onSuccess?: () => void;
}

export function FaqForm({
  defaultValues,
  action,
  submitLabel,
  submittingLabel,
  onSuccess,
}: FaqFormProps) {
  const t = locales[defaultLocale];
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqFormInput>({
    resolver: zodResolver(faqFormSchema),
    defaultValues,
  });

  function onSubmit(values: FaqFormInput) {
    startTransition(async () => {
      const result = await action(values);
      if (result) {
        toast.error(t.admin.faqs.errors[result.errorCode]);
        return;
      }

      toast.success(t.admin.faqs.saveSuccess);
      if (onSuccess) {
        onSuccess();
      } else {
        reset();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="question">{t.admin.faqs.form.questionLabel}</Label>
        <Input
          id="question"
          type="text"
          maxLength={FAQ_QUESTION_MAX_LENGTH}
          {...register('question')}
        />
        {errors.question ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(t.admin.faqs.errors.fields.question, errors.question.type)}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="answer">{t.admin.faqs.form.answerLabel}</Label>
        <textarea
          id="answer"
          rows={6}
          maxLength={FAQ_ANSWER_MAX_LENGTH}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          {...register('answer')}
        />
        {errors.answer ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(t.admin.faqs.errors.fields.answer, errors.answer.type)}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}

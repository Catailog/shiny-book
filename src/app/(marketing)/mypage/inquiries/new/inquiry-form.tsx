'use client';

import { useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { CharCounterField } from '@/components/char-counter-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { INQUIRY_CONTENT_MAX_LENGTH, INQUIRY_TITLE_MAX_LENGTH } from '@/constants/inquiry';
import { INQUIRY_CATEGORY, type InquiryCategory } from '@/constants/inquiry-category';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';
import type { Tables } from '@/lib/db/database.types';
import { formatDate } from '@/lib/format-date';
import { formatIdPrefix } from '@/lib/format-id-prefix';
import { fieldErrorMessage } from '@/lib/forms/field-error-message';

import { createInquiry } from './actions';
import { type InquiryFormInput, inquiryFormSchema } from './inquiry-schema';

interface InquiryFormProps {
  orders: Tables<'orders'>[];
  defaultCategory: InquiryCategory;
  defaultOrderId?: string;
}

export function InquiryForm({ orders, defaultCategory, defaultOrderId }: InquiryFormProps) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFormInput>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: { category: defaultCategory, orderId: defaultOrderId, title: '', content: '' },
  });
  const category = useWatch({ control, name: 'category' });

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
        <Label htmlFor="inquiry-category">{t.consumer.inquiries.form.categoryLabel}</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="inquiry-category" className="w-full">
                <SelectValue>
                  {(value: InquiryCategory) => t.consumer.inquiries.form.categoryOptions[value]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={INQUIRY_CATEGORY.GENERAL}>
                  {t.consumer.inquiries.form.categoryOptions.general}
                </SelectItem>
                <SelectItem value={INQUIRY_CATEGORY.ORDER}>
                  {t.consumer.inquiries.form.categoryOptions.order}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {category === INQUIRY_CATEGORY.ORDER && orders.length > 0 ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="inquiry-order">{t.consumer.inquiries.form.relatedOrderLabel}</Label>
          <Controller
            control={control}
            name="orderId"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="inquiry-order" className="w-full">
                  <SelectValue placeholder={t.consumer.inquiries.form.relatedOrderPlaceholder}>
                    {(value: string) => {
                      const selected = orders.find((order) => order.id === value);
                      return selected ? `${selected.title} (${formatIdPrefix(selected.id)})` : null;
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.title} ({formatIdPrefix(order.id)}, {formatDate(order.created_at)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="inquiry-title">{t.consumer.inquiries.form.titleLabel}</Label>
        <Input
          id="inquiry-title"
          placeholder={t.consumer.inquiries.form.titlePlaceholder}
          {...register('title')}
        />
        <CharCounterField
          control={control}
          name="title"
          max={INQUIRY_TITLE_MAX_LENGTH}
          message={t.common.charLimitHint.replace('{max}', String(INQUIRY_TITLE_MAX_LENGTH))}
        />
        {errors.title ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(t.consumer.inquiries.errors.fields.title, errors.title.type)}
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
        <CharCounterField
          control={control}
          name="content"
          max={INQUIRY_CONTENT_MAX_LENGTH}
          message={t.common.charLimitHint.replace('{max}', String(INQUIRY_CONTENT_MAX_LENGTH))}
        />
        {errors.content ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(t.consumer.inquiries.errors.fields.content, errors.content.type)}
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
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending
            ? t.consumer.inquiries.form.submitting
            : t.consumer.inquiries.form.submitButton}
        </Button>
      </div>
    </form>
  );
}

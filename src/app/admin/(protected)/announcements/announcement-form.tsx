'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

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
import {
  ANNOUNCEMENT_CONTENT_MAX_LENGTH,
  ANNOUNCEMENT_TITLE_MAX_LENGTH,
} from '@/constants/announcement';
import {
  ANNOUNCEMENT_CATEGORY,
  type AnnouncementCategory,
} from '@/constants/announcement-category';
import { fieldErrorMessage } from '@/lib/forms/field-error-message';
import { defaultLocale, locales } from '@/locales';

import type { AnnouncementActionResult } from './actions';
import { type AnnouncementFormInput, announcementFormSchema } from './announcement-schema';

interface AnnouncementFormProps {
  defaultValues?: AnnouncementFormInput;
  action: (values: AnnouncementFormInput) => Promise<AnnouncementActionResult | undefined>;
  submitLabel: string;
  submittingLabel: string;
  onSuccess?: () => void;
}

export function AnnouncementForm({
  defaultValues,
  action,
  submitLabel,
  submittingLabel,
  onSuccess,
}: AnnouncementFormProps) {
  const t = locales[defaultLocale];
  const [isPending, startTransition] = useTransition();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormInput>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: defaultValues ?? { category: ANNOUNCEMENT_CATEGORY.NOTICE },
  });

  function onSubmit(values: AnnouncementFormInput) {
    startTransition(async () => {
      const result = await action(values);
      if (result) {
        toast.error(t.admin.announcements.errors[result.errorCode]);
        return;
      }

      toast.success(t.admin.announcements.saveSuccess);
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
        <Label htmlFor="title">{t.admin.announcements.form.titleLabel}</Label>
        <Input
          id="title"
          type="text"
          maxLength={ANNOUNCEMENT_TITLE_MAX_LENGTH}
          {...register('title')}
        />
        {errors.title ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(t.admin.announcements.errors.fields.title, errors.title.type)}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">{t.admin.announcements.form.categoryLabel}</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="category" className="w-40">
                <SelectValue>
                  {(value: AnnouncementCategory) => t.announcementCategories[value]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.values(ANNOUNCEMENT_CATEGORY).map((category) => (
                  <SelectItem key={category} value={category}>
                    {t.announcementCategories[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">{t.admin.announcements.form.contentLabel}</Label>
        <textarea
          id="content"
          rows={8}
          maxLength={ANNOUNCEMENT_CONTENT_MAX_LENGTH}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          {...register('content')}
        />
        {errors.content ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(t.admin.announcements.errors.fields.content, errors.content.type)}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}

'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useT } from '@/hooks/use-t';

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
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormInput>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues,
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
        <Input id="title" type="text" {...register('title')} />
        {errors.title ? (
          <p className="text-sm text-destructive">
            {t.admin.announcements.errors.validation_failed}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">{t.admin.announcements.form.contentLabel}</Label>
        <textarea
          id="content"
          rows={8}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          {...register('content')}
        />
        {errors.content ? (
          <p className="text-sm text-destructive">
            {t.admin.announcements.errors.validation_failed}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}

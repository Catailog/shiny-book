'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useT } from '@/hooks/use-t';

import { updateNotificationPreferences } from './actions';
import {
  type NotificationPreferencesInput,
  notificationPreferencesSchema,
} from './notification-schema';

interface NotificationPreferencesFormProps {
  defaultValues: NotificationPreferencesInput;
}

export function NotificationPreferencesForm({ defaultValues }: NotificationPreferencesFormProps) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const { control, handleSubmit } = useForm<NotificationPreferencesInput>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues,
  });

  function onSubmit(values: NotificationPreferencesInput) {
    startTransition(async () => {
      const result = await updateNotificationPreferences(values);
      if (result) {
        toast.error(t.consumer.account.errors[result.errorCode]);
        return;
      }

      toast.success(t.consumer.account.success);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="marketingEmailConsent"
            render={({ field }) => (
              <Checkbox id="notify-email" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="notify-email" className="font-normal">
            {t.consumer.account.notifications.emailMarketing}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="marketingSmsConsent"
            render={({ field }) => (
              <Checkbox id="notify-sms" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="notify-sms" className="font-normal">
            {t.consumer.account.notifications.smsUpdates}
          </Label>
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? t.consumer.account.submitting : t.consumer.account.submitButton}
      </Button>
    </form>
  );
}

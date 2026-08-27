'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useT } from '@/hooks/use-t';

import { updateConsumerPhone } from './actions';
import { type PhoneFormInput, phoneFormSchema } from './phone-schema';

interface PhoneFormProps {
  currentPhone: string;
}

export function PhoneForm({ currentPhone }: PhoneFormProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormInput>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: { phone: currentPhone || undefined },
  });

  function onSubmit(values: PhoneFormInput) {
    startTransition(async () => {
      const result = await updateConsumerPhone(values);
      if (result) {
        toast.error(t.consumer.account.errors[result.errorCode]);
        return;
      }

      toast.success(t.consumer.account.personalInfo.phoneUpdateSuccess);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<button type="button" className="text-sm text-primary" />}>
        {t.consumer.account.personalInfo.editLink}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.consumer.account.personalInfo.editPhoneTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-phone">{t.consumer.account.personalInfo.phoneLabel}</Label>
            <Input
              id="edit-phone"
              type="tel"
              autoComplete="tel"
              {...register('phone', {
                setValueAs: (value: string) => (value === '' ? undefined : value),
              })}
            />
            <p className="text-xs text-muted-foreground">
              {t.consumer.account.personalInfo.phonePlaceholder}
            </p>
            {errors.phone ? (
              <p className="text-sm text-destructive">
                {t.consumer.account.personalInfo.phoneInvalid}
              </p>
            ) : null}
          </div>
          <Button type="submit" variant="primary" disabled={isPending} className="w-fit">
            {isPending ? t.consumer.account.submitting : t.consumer.account.submitButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

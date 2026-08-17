'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useT } from '@/hooks/use-t';

import { changeConsumerPassword } from './actions';
import { type ChangePasswordInput, changePasswordSchema } from './password-schema';

export function ChangePasswordForm() {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  function onSubmit(values: ChangePasswordInput) {
    startTransition(async () => {
      const result = await changeConsumerPassword(values);
      if (result) {
        toast.error(t.consumer.account.errors[result.errorCode]);
        return;
      }

      toast.success(t.consumer.account.success);
      reset();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="new-password" className="text-xs font-semibold tracking-wide uppercase">
          {t.consumer.account.passwordLabel}
        </Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{t.consumer.account.errors.passwordTooShort}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="new-password-confirm"
          className="text-xs font-semibold tracking-wide uppercase"
        >
          {t.consumer.account.passwordConfirmLabel}
        </Label>
        <Input
          id="new-password-confirm"
          type="password"
          autoComplete="new-password"
          {...register('passwordConfirm')}
        />
        {errors.passwordConfirm ? (
          <p className="text-sm text-destructive">{t.consumer.account.errors.passwordMismatch}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? t.consumer.account.submitting : t.consumer.account.submitButton}
      </Button>
    </form>
  );
}

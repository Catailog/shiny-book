'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { defaultLocale, locales } from '@/locales';

import { signInAdmin } from './actions';
import { type AdminLoginInput, adminLoginSchema } from './login-schema';

export function AdminLoginForm() {
  const t = locales[defaultLocale];
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInput>({ resolver: zodResolver(adminLoginSchema) });

  function onSubmit(values: AdminLoginInput) {
    startTransition(async () => {
      const result = await signInAdmin(values);
      if (result) {
        toast.error(t.admin.login.errors[result.errorCode]);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-xs font-semibold">
          {t.admin.login.emailLabel}
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="bg-input-background"
          {...register('email')}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{t.admin.login.errors.emailInvalid}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs font-semibold">
            {t.admin.login.passwordLabel}
          </Label>
          <span className="text-xs font-medium text-primary">
            {t.admin.login.forgotPasswordLink}
          </span>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          className="bg-input-background"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{t.admin.login.errors.passwordRequired}</p>
        ) : null}
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isPending ? t.admin.login.submitting : t.admin.login.submitButton}
      </Button>
    </form>
  );
}

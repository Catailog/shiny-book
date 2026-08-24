'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Coachmark } from '@/components/coachmark';
import { TurnstileWidget } from '@/components/turnstile-widget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { defaultLocale, locales } from '@/locales';

import { signInAdmin, signInTestAdmin } from './actions';
import { type AdminLoginInput, adminLoginSchema } from './login-schema';

interface AdminLoginFormProps {
  allowTestLogin: boolean;
}

export function AdminLoginForm({ allowTestLogin }: AdminLoginFormProps) {
  const t = locales[defaultLocale];
  const [isPending, startTransition] = useTransition();
  const [isTestLoginPending, startTestLoginTransition] = useTransition();
  const [turnstileToken, setTurnstileToken] = useState('');
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

  function handleTestLogin() {
    startTestLoginTransition(async () => {
      const result = await signInTestAdmin(turnstileToken);
      if (result) {
        toast.error(t.admin.login.testLoginErrors[result.errorCode]);
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
        <Label htmlFor="password" className="text-xs font-semibold">
          {t.admin.login.passwordLabel}
        </Label>
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
      <Button type="submit" variant="primary" disabled={isPending} className="w-full">
        {isPending ? t.admin.login.submitting : t.admin.login.submitButton}
      </Button>
      {allowTestLogin ? (
        <div className="flex flex-col gap-2">
          <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
          <Coachmark
            id="test-login-admin"
            title={t.admin.login.coachmarkTestLoginTitle}
            description={t.admin.login.coachmarkTestLoginDescription}
            closeLabel={t.common.coachmarkClose}
          >
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isTestLoginPending || !turnstileToken}
                    onClick={handleTestLogin}
                    className="w-full"
                  />
                }
              >
                {isTestLoginPending
                  ? t.admin.login.testLoginSubmitting
                  : t.admin.login.testLoginButton}
              </TooltipTrigger>
              <TooltipContent>{t.admin.login.testLoginTooltip}</TooltipContent>
            </Tooltip>
          </Coachmark>
        </div>
      ) : null}
    </form>
  );
}

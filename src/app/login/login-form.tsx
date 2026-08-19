'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';

import { signInConsumer, signInTestConsumer } from './actions';
import { type ConsumerLoginInput, consumerLoginSchema } from './login-schema';

interface ConsumerLoginFormProps {
  redirectTo: string;
  allowTestLogin: boolean;
}

export function ConsumerLoginForm({ redirectTo, allowTestLogin }: ConsumerLoginFormProps) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [isTestLoginPending1, startTestLoginTransition1] = useTransition();
  const [isTestLoginPending2, startTestLoginTransition2] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsumerLoginInput>({ resolver: zodResolver(consumerLoginSchema) });

  function onSubmit(values: ConsumerLoginInput) {
    startTransition(async () => {
      const result = await signInConsumer(values, redirectTo);
      if (result) {
        toast.error(t.consumer.login.errors[result.errorCode]);
      }
    });
  }

  function handleTestLogin1() {
    startTestLoginTransition1(async () => {
      const result = await signInTestConsumer(1, redirectTo);
      if (result) {
        toast.error(t.consumer.login.testLoginErrors[result.errorCode]);
      }
    });
  }

  function handleTestLogin2() {
    startTestLoginTransition2(async () => {
      const result = await signInTestConsumer(2, redirectTo);
      if (result) {
        toast.error(t.consumer.login.testLoginErrors[result.errorCode]);
      }
    });
  }

  return (
    <div className="w-full max-w-120 rounded-xl border border-border bg-card p-12 shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {t.consumer.login.title}
          </h1>
          <p className="text-sm text-muted-foreground">{t.consumer.login.subtitle}</p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-xs font-semibold tracking-wide uppercase">
              {t.consumer.login.emailLabel}
            </Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email ? (
              <p className="text-sm text-destructive">{t.consumer.login.errors.emailInvalid}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase">
              {t.consumer.login.passwordLabel}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                className="pr-11"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                aria-label={
                  isPasswordVisible
                    ? t.consumer.login.hidePasswordLabel
                    : t.consumer.login.showPasswordLabel
                }
                className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {isPasswordVisible ? (
                  <EyeOff aria-hidden="true" className="size-4" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="text-sm text-destructive">{t.consumer.login.errors.passwordRequired}</p>
            ) : null}
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          className="w-full text-sm font-semibold uppercase"
        >
          {isPending ? t.consumer.login.submitting : t.consumer.login.submitButton}
        </Button>
        {allowTestLogin ? (
          <div className="flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isTestLoginPending1}
                    onClick={handleTestLogin1}
                    className="w-full text-sm font-semibold uppercase"
                  />
                }
              >
                {isTestLoginPending1
                  ? t.consumer.login.testLoginSubmitting
                  : t.consumer.login.testLoginButton1}
              </TooltipTrigger>
              <TooltipContent>{t.consumer.login.testLoginTooltip}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isTestLoginPending2}
                    onClick={handleTestLogin2}
                    className="w-full text-sm font-semibold uppercase"
                  />
                }
              >
                {isTestLoginPending2
                  ? t.consumer.login.testLoginSubmitting
                  : t.consumer.login.testLoginButton2}
              </TooltipTrigger>
              <TooltipContent>{t.consumer.login.testLoginTooltip}</TooltipContent>
            </Tooltip>
          </div>
        ) : null}
        <p className="text-center text-sm text-muted-foreground">
          {t.consumer.login.signupPrompt}{' '}
          <Link
            href={`${CONSUMER_ROUTES.SIGNUP}?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="font-semibold text-primary underline"
          >
            {t.consumer.login.signupLink}
          </Link>
        </p>
      </form>
    </div>
  );
}

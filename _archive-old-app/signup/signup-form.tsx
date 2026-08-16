'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';

import { signUpConsumer } from './actions';
import { type ConsumerSignupInput, consumerSignupSchema } from './signup-schema';

export function ConsumerSignupForm() {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsumerSignupInput>({ resolver: zodResolver(consumerSignupSchema) });

  function onSubmit(values: ConsumerSignupInput) {
    startTransition(async () => {
      const result = await signUpConsumer(values);
      if (result) {
        toast.error(t.consumer.signup.errors[result.errorCode]);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t.consumer.signup.emailLabel}</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? (
          <p className="text-sm text-destructive">{t.consumer.signup.errors.emailInvalid}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{t.consumer.signup.passwordLabel}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{t.consumer.signup.errors.passwordTooShort}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="passwordConfirm">{t.consumer.signup.passwordConfirmLabel}</Label>
        <Input
          id="passwordConfirm"
          type="password"
          autoComplete="new-password"
          {...register('passwordConfirm')}
        />
        {errors.passwordConfirm ? (
          <p className="text-sm text-destructive">{t.consumer.signup.errors.passwordMismatch}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t.consumer.signup.submitting : t.consumer.signup.submitButton}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {t.consumer.signup.loginPrompt}{' '}
        <Link href={CONSUMER_ROUTES.LOGIN} className="font-medium text-foreground underline">
          {t.consumer.signup.loginLink}
        </Link>
      </p>
    </form>
  );
}

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

import { signInConsumer } from './actions';
import { type ConsumerLoginInput, consumerLoginSchema } from './login-schema';

export function ConsumerLoginForm() {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsumerLoginInput>({ resolver: zodResolver(consumerLoginSchema) });

  function onSubmit(values: ConsumerLoginInput) {
    startTransition(async () => {
      const result = await signInConsumer(values);
      if (result) {
        toast.error(t.consumer.login.errors[result.errorCode]);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t.consumer.login.emailLabel}</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email ? (
          <p className="text-sm text-destructive">{t.consumer.login.errors.emailInvalid}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{t.consumer.login.passwordLabel}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password ? (
          <p className="text-sm text-destructive">{t.consumer.login.errors.passwordRequired}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t.consumer.login.submitting : t.consumer.login.submitButton}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {t.consumer.login.signupPrompt}{' '}
        <Link href={CONSUMER_ROUTES.SIGNUP} className="font-medium text-foreground underline">
          {t.consumer.login.signupLink}
        </Link>
      </p>
    </form>
  );
}

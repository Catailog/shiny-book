'use client';

import { useState, useTransition } from 'react';

import Link from 'next/link';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';

import { signInConsumer } from './actions';

export function ConsumerLoginForm() {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      await signInConsumer();
    });
  }

  return (
    <div className="w-full max-w-120 rounded-xl border border-border bg-card p-12 shadow-lg">
      <form onSubmit={onSubmit} className="flex flex-col gap-8" noValidate>
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
            <Input id="email" type="email" autoComplete="email" className="h-auto rounded p-4" />
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
                className="h-auto rounded p-4 pr-11"
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
          </div>
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="h-auto w-full rounded bg-primary p-4 text-sm font-semibold text-primary-foreground uppercase hover:bg-primary/90"
        >
          {isPending ? t.consumer.login.submitting : t.consumer.login.submitButton}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {t.consumer.login.signupPrompt}{' '}
          <Link href={CONSUMER_ROUTES.SIGNUP} className="font-semibold text-primary underline">
            {t.consumer.login.signupLink}
          </Link>
        </p>
      </form>
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';

import Link from 'next/link';

import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';
import { mockSignInConsumer } from '@/lib/mock/mock-session-actions';

export function SignupForm() {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      await mockSignInConsumer();
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{t.consumer.signup.nameLabel}</Label>
        <Input id="name" autoComplete="name" placeholder={t.consumer.signup.namePlaceholder} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t.consumer.signup.emailLabel}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t.consumer.signup.emailPlaceholder}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{t.consumer.signup.passwordLabel}</Label>
        <div className="relative">
          <Input
            id="password"
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="new-password"
            className="pr-11"
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
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password-confirm">{t.consumer.signup.passwordConfirmLabel}</Label>
        <div className="relative">
          <Input
            id="password-confirm"
            type={isConfirmVisible ? 'text' : 'password'}
            autoComplete="new-password"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setIsConfirmVisible((visible) => !visible)}
            aria-label={
              isConfirmVisible
                ? t.consumer.login.hidePasswordLabel
                : t.consumer.login.showPasswordLabel
            }
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
          >
            {isConfirmVisible ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="agree-terms" defaultChecked />
        <Label htmlFor="agree-terms" className="font-normal text-muted-foreground">
          {t.consumer.signup.agreeTermsLabel}
        </Label>
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="h-auto w-full rounded bg-primary p-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        {isPending ? t.consumer.signup.submitting : t.consumer.signup.submitButton}
      </Button>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground uppercase">
          {t.consumer.signup.socialDividerLabel}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="secondary" className="flex-1">
          {t.consumer.signup.googleButton}
        </Button>
        <Button type="button" variant="secondary" className="flex-1">
          {t.consumer.signup.appleButton}
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        {t.consumer.signup.loginPrompt}{' '}
        <Link href={CONSUMER_ROUTES.LOGIN} className="font-semibold text-primary underline">
          {t.consumer.signup.loginLink}
        </Link>
      </p>
    </form>
  );
}

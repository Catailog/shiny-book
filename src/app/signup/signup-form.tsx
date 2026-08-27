'use client';

import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { CharCounterField } from '@/components/char-counter-field';
import { PhoneInput } from '@/components/phone-input';
import { TurnstileWidget } from '@/components/turnstile-widget';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PERSON_NAME_MAX_LENGTH } from '@/constants/person-name';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';

import { signUpConsumer } from './actions';
import { type ConsumerSignupInput, consumerSignupSchema } from './signup-schema';

interface SignupFormProps {
  redirectTo: string;
}

export function SignupForm({ redirectTo }: SignupFormProps) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsumerSignupInput>({
    resolver: zodResolver(consumerSignupSchema),
    defaultValues: {
      agreeTerms: false,
      agreePrivacy: false,
      marketingEmailConsent: false,
      marketingSmsConsent: false,
    },
  });

  function onSubmit(values: ConsumerSignupInput) {
    startTransition(async () => {
      const result = await signUpConsumer(values, redirectTo, turnstileToken);
      if (result) {
        toast.error(t.consumer.signup.errors[result.errorCode]);
      }
    });
  }

  return (
    <div className="w-full max-w-120 rounded-xl border border-border bg-card p-12 shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            {t.consumer.signup.title}
          </h1>
          <p className="text-sm text-muted-foreground">{t.consumer.signup.subtitle}</p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-xs font-semibold tracking-wide uppercase">
              {t.consumer.signup.nameLabel}
            </Label>
            <Input
              id="name"
              autoComplete="name"
              maxLength={PERSON_NAME_MAX_LENGTH}
              {...register('name')}
            />
            <CharCounterField control={control} name="name" max={PERSON_NAME_MAX_LENGTH} />
            {errors.name ? (
              <p className="text-sm text-destructive">{t.consumer.signup.errors.nameRequired}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-xs font-semibold tracking-wide uppercase">
              {t.consumer.signup.emailLabel}
            </Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email ? (
              <p className="text-sm text-destructive">{t.consumer.signup.errors.emailInvalid}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase">
              {t.consumer.signup.passwordLabel}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="new-password"
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
              <p className="text-sm text-destructive">
                {t.consumer.signup.errors.passwordTooShort}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="password-confirm"
              className="text-xs font-semibold tracking-wide uppercase"
            >
              {t.consumer.signup.passwordConfirmLabel}
            </Label>
            <div className="relative">
              <Input
                id="password-confirm"
                type={isConfirmVisible ? 'text' : 'password'}
                autoComplete="new-password"
                className="pr-11"
                {...register('passwordConfirm')}
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
            {errors.passwordConfirm ? (
              <p className="text-sm text-destructive">
                {errors.passwordConfirm.type === 'too_small'
                  ? t.consumer.signup.errors.passwordConfirmRequired
                  : t.consumer.signup.errors.passwordMismatch}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone" className="text-xs font-semibold tracking-wide uppercase">
              {t.consumer.signup.phoneLabel}
            </Label>
            <PhoneInput
              id="phone"
              {...register('phone', {
                setValueAs: (value: string) => (value === '' ? undefined : value),
              })}
            />
            {errors.phone ? (
              <p className="text-sm text-destructive">{t.consumer.signup.errors.phoneInvalid}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="agreeTerms"
                render={({ field }) => (
                  <Checkbox
                    id="agree-terms"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="agree-terms" className="font-normal text-muted-foreground">
                {t.consumer.signup.agreeTermsLabel}
              </Label>
            </div>
            {errors.agreeTerms ? (
              <p className="text-sm text-destructive">
                {t.consumer.signup.errors.agreeTermsRequired}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="agreePrivacy"
                render={({ field }) => (
                  <Checkbox
                    id="agree-privacy"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="agree-privacy" className="font-normal text-muted-foreground">
                {t.consumer.signup.agreePrivacyLabel}
              </Label>
            </div>
            {errors.agreePrivacy ? (
              <p className="text-sm text-destructive">
                {t.consumer.signup.errors.agreePrivacyRequired}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="marketingEmailConsent"
              render={({ field }) => (
                <Checkbox
                  id="marketing-email-consent"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="marketing-email-consent" className="font-normal text-muted-foreground">
              {t.consumer.signup.marketingEmailLabel}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="marketingSmsConsent"
              render={({ field }) => (
                <Checkbox
                  id="marketing-sms-consent"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="marketing-sms-consent" className="font-normal text-muted-foreground">
              {t.consumer.signup.marketingSmsLabel}
            </Label>
          </div>
        </div>
        <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="submit"
                variant="primary"
                disabled={isPending || !turnstileToken}
                className="w-full text-sm font-semibold uppercase"
              />
            }
          >
            {isPending ? t.consumer.signup.submitting : t.consumer.signup.submitButton}
          </TooltipTrigger>
          {!turnstileToken ? (
            <TooltipContent>{t.common.turnstilePendingTooltip}</TooltipContent>
          ) : null}
        </Tooltip>
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground uppercase">
            {t.consumer.signup.socialDividerLabel}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" className="h-auto flex-1 rounded p-4">
            {t.consumer.signup.googleButton}
          </Button>
          <Button type="button" variant="secondary" className="h-auto flex-1 rounded p-4">
            {t.consumer.signup.appleButton}
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {t.consumer.signup.loginPrompt}{' '}
          <Link
            href={`${CONSUMER_ROUTES.LOGIN}?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="font-semibold text-primary underline"
          >
            {t.consumer.signup.loginLink}
          </Link>
        </p>
      </form>
    </div>
  );
}

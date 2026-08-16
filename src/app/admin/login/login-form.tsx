'use client';

import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useT } from '@/hooks/use-t';

import { signInAdmin } from './actions';

export function AdminLoginForm() {
  const t = useT();
  const [isPending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      await signInAdmin();
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t.admin.login.emailLabel}</Label>
        <Input id="email" type="email" autoComplete="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{t.admin.login.passwordLabel}</Label>
        <Input id="password" type="password" autoComplete="current-password" />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t.admin.login.submitting : t.admin.login.submitButton}
      </Button>
    </form>
  );
}

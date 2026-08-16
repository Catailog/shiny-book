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
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-xs font-semibold">
          {t.admin.login.emailLabel}
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          defaultValue="admin@bookcraft.studio"
          className="bg-muted"
        />
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
        <Input id="password" type="password" autoComplete="current-password" className="bg-muted" />
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

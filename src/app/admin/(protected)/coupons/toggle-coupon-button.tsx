'use client';

import { useActionState, useEffect } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { defaultLocale, locales } from '@/locales';

import { type ToggleCouponState, toggleCouponActive } from './actions';

interface ToggleCouponButtonProps {
  couponId: string;
  isActive: boolean;
}

const initialState: ToggleCouponState = { error: null };

export function ToggleCouponButton({ couponId, isActive }: ToggleCouponButtonProps) {
  const t = locales[defaultLocale];
  const [state, formAction, isPending] = useActionState(
    toggleCouponActive.bind(null, couponId, isActive),
    initialState,
  );

  useEffect(() => {
    if (state.error) {
      toast.error(t.admin.coupons.errors[state.error]);
    }
  }, [state.error, t]);

  return (
    <form action={formAction}>
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        {isActive ? t.admin.coupons.deactivateButton : t.admin.coupons.activateButton}
      </Button>
    </form>
  );
}

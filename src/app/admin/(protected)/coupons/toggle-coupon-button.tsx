'use client';

import { useActionState, useEffect } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useT } from '@/hooks/use-t';

import { type ToggleCouponState, toggleCouponActive } from './actions';

interface ToggleCouponButtonProps {
  couponId: string;
  isActive: boolean;
}

const initialState: ToggleCouponState = { error: null };

export function ToggleCouponButton({ couponId, isActive }: ToggleCouponButtonProps) {
  const t = useT();
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

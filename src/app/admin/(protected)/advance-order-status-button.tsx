'use client';

import { useActionState, useEffect } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@/constants/order-status';
import { defaultLocale, locales } from '@/locales';

import { type AdvanceOrderStatusState, advanceOrderStatus } from './order-status-actions';

interface AdvanceOrderStatusButtonProps {
  orderId: string;
  from: OrderStatus;
  to: OrderStatus;
}

const initialState: AdvanceOrderStatusState = { error: null };

export function AdvanceOrderStatusButton({ orderId, from, to }: AdvanceOrderStatusButtonProps) {
  const t = locales[defaultLocale];
  const [state, formAction, isPending] = useActionState(
    advanceOrderStatus.bind(null, orderId, from, to),
    initialState,
  );

  useEffect(() => {
    if (state.error) {
      toast.error(t.admin.orders.statusChangeErrors[state.error]);
    }
  }, [state.error, t]);

  return (
    <form action={formAction}>
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        {t.admin.orders.advanceButton}
      </Button>
    </form>
  );
}

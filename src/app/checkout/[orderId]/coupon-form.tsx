'use client';

import { useState, useTransition } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { COUPON_CODE_MAX_LENGTH } from '@/constants/coupon';
import { useT } from '@/hooks/use-t';

import { applyCouponToOrder } from './coupon-actions';

interface CouponFormProps {
  orderId: string;
}

export function CouponForm({ orderId }: CouponFormProps) {
  const t = useT();
  const [code, setCode] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleApply() {
    if (code.trim().length === 0) {
      return;
    }

    startTransition(async () => {
      const result = await applyCouponToOrder(orderId, { code });
      if (result) {
        toast.error(t.checkout.coupon.errors[result.errorCode]);
        return;
      }
      toast.success(t.checkout.coupon.applySuccess);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="checkout-coupon-code">{t.checkout.coupon.label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id="checkout-coupon-code"
          type="text"
          value={code}
          maxLength={COUPON_CODE_MAX_LENGTH}
          onChange={(event) => setCode(event.target.value)}
          className="flex-1"
        />
        <Button type="button" variant="outline" disabled={isPending} onClick={handleApply}>
          {isPending ? t.checkout.coupon.applying : t.checkout.coupon.applyButton}
        </Button>
      </div>
    </div>
  );
}

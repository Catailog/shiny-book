'use client';

import { useState, useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { REFUND_REASON_MAX_LENGTH } from '@/constants/refund';
import { useT } from '@/hooks/use-t';

import { requestRefundAction } from './refund-actions';

interface RequestRefundButtonProps {
  orderId: string;
}

export function RequestRefundButton({ orderId }: RequestRefundButtonProps) {
  const t = useT();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setReason('');
    setAmount('');
    setReasonError(null);
    setAmountError(null);
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  }

  function handleSubmit() {
    const trimmedReason = reason.trim();
    const trimmedAmount = amount.trim();
    let hasError = false;

    if (trimmedReason.length === 0) {
      setReasonError(t.consumer.mypage.orders.refund.reasonRequired);
      hasError = true;
    } else {
      setReasonError(null);
    }

    let parsedAmount: number | undefined;
    if (trimmedAmount.length > 0) {
      if (!/^\d+$/.test(trimmedAmount) || Number(trimmedAmount) <= 0) {
        setAmountError(t.consumer.mypage.orders.refund.amountInvalid);
        hasError = true;
      } else {
        setAmountError(null);
        parsedAmount = Number(trimmedAmount);
      }
    } else {
      setAmountError(null);
    }

    if (hasError) {
      return;
    }

    startTransition(async () => {
      const result = await requestRefundAction(orderId, {
        reason: trimmedReason,
        ...(parsedAmount === undefined ? {} : { amount: parsedAmount }),
      });

      if (result.errorCode) {
        toast.error(t.consumer.mypage.orders.refund.errors[result.errorCode]);
        return;
      }

      toast.success(t.consumer.mypage.orders.refund.success);
      handleOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<button type="button" className="text-xs text-muted-foreground underline" />}
      >
        {t.consumer.mypage.orders.refund.button}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.consumer.mypage.orders.refund.dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="refund-reason">{t.consumer.mypage.orders.refund.reasonLabel}</Label>
            <Textarea
              id="refund-reason"
              value={reason}
              maxLength={REFUND_REASON_MAX_LENGTH}
              rows={3}
              onChange={(event) => setReason(event.target.value)}
            />
            {reasonError ? <p className="text-sm text-destructive">{reasonError}</p> : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="refund-amount">{t.consumer.mypage.orders.refund.amountLabel}</Label>
            <Input
              id="refund-amount"
              inputMode="numeric"
              value={amount}
              placeholder={t.consumer.mypage.orders.refund.amountHint}
              onChange={(event) => setAmount(event.target.value)}
            />
            {amountError ? <p className="text-sm text-destructive">{amountError}</p> : null}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            {t.consumer.mypage.orders.refund.cancel}
          </Button>
          <Button type="button" disabled={isPending} onClick={handleSubmit}>
            {isPending
              ? t.consumer.mypage.orders.refund.submitting
              : t.consumer.mypage.orders.refund.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

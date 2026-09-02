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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { REFUND_NOTE_MAX_LENGTH } from '@/constants/refund';
import { formatCurrency } from '@/lib/format/currency';
import { defaultLocale, locales } from '@/locales';

import { refundOrder } from './refund-order-actions';

interface RefundDialogProps {
  orderId: string;
  orderAmount: number;
  refundedAmount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RefundDialog({
  orderId,
  orderAmount,
  refundedAmount,
  open,
  onOpenChange,
}: RefundDialogProps) {
  const t = locales[defaultLocale];
  const router = useRouter();
  const remaining = orderAmount - refundedAmount;
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setAmount('');
      setNote('');
      setAmountError(null);
    }
  }

  function handleSubmit() {
    const trimmedAmount = amount.trim();
    let parsedAmount: number | undefined;

    if (trimmedAmount.length > 0) {
      if (!/^\d+$/.test(trimmedAmount) || Number(trimmedAmount) <= 0) {
        setAmountError(t.admin.orders.refund.amountInvalid);
        return;
      }
      if (Number(trimmedAmount) > remaining) {
        setAmountError(t.admin.orders.refund.amountTooLarge);
        return;
      }
      parsedAmount = Number(trimmedAmount);
    }
    setAmountError(null);

    startTransition(async () => {
      const result = await refundOrder(orderId, {
        ...(parsedAmount === undefined ? {} : { amount: parsedAmount }),
        ...(note.trim() ? { note: note.trim() } : {}),
      });

      if (result.errorCode) {
        toast.error(t.admin.orders.refund.errors[result.errorCode]);
        return;
      }

      toast.success(t.admin.orders.refund.success);
      handleOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.admin.orders.refund.dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {t.admin.orders.refund.remainingLabel} {formatCurrency(remaining)}
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="refund-amount">{t.admin.orders.refund.amountLabel}</Label>
            <Input
              id="refund-amount"
              inputMode="numeric"
              value={amount}
              placeholder={t.admin.orders.refund.amountHint}
              onChange={(event) => setAmount(event.target.value)}
            />
            {amountError ? <p className="text-sm text-destructive">{amountError}</p> : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="refund-note">{t.admin.orders.refund.noteLabel}</Label>
            <Textarea
              id="refund-note"
              value={note}
              rows={2}
              maxLength={REFUND_NOTE_MAX_LENGTH}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            {t.admin.orders.refund.cancel}
          </Button>
          <Button type="button" variant="destructive" disabled={isPending} onClick={handleSubmit}>
            {isPending ? t.admin.orders.refund.submitting : t.admin.orders.refund.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

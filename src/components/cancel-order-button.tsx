'use client';

import { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';
import { cancelConsumerOrder } from '@/lib/orders/cancel-consumer-order';

interface CancelOrderButtonProps {
  orderId: string;
  className?: string;
}

export function CancelOrderButton({ orderId, className }: CancelOrderButtonProps) {
  const t = useT();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await cancelConsumerOrder(orderId);
      if (result) {
        toast.error(t.checkout.cancelOrder.errors[result.errorCode]);
        return;
      }
      toast.success(t.checkout.cancelOrder.success);
      router.push(CONSUMER_ROUTES.MYPAGE);
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            className={className ?? 'text-sm font-medium text-destructive underline'}
          />
        }
      >
        {t.checkout.cancelOrder.button}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.checkout.cancelOrder.confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.checkout.cancelOrder.confirmDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.checkout.cancelOrder.cancelButton}</AlertDialogCancel>
          <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleConfirm}>
            {t.checkout.cancelOrder.confirmButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

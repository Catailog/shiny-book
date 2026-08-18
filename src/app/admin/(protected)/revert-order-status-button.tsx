'use client';

import { useTransition } from 'react';

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
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@/constants/order-status';
import { defaultLocale, locales } from '@/locales';

import { revertOrderStatusAction } from './order-status-actions';

interface RevertOrderStatusButtonProps {
  orderId: string;
  from: OrderStatus;
  to: OrderStatus;
}

export function RevertOrderStatusButton({ orderId, from, to }: RevertOrderStatusButtonProps) {
  const t = locales[defaultLocale];
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await revertOrderStatusAction(orderId, from, to);
      if (result.error) {
        toast.error(t.admin.orders.statusChangeErrors[result.error]);
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button type="button" variant="outline" size="sm" disabled={isPending} />}
      >
        {t.admin.orders.revertButton}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.admin.orders.revertConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{t.admin.orders.revertConfirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.admin.orders.revertCancelButton}</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleConfirm}>
            {t.admin.orders.revertConfirmButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

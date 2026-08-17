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
import { useT } from '@/hooks/use-t';

import { deleteConsumerAccount } from './actions';

export function DeleteAccountButton() {
  const t = useT();
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteConsumerAccount();
      if (result) {
        toast.error(t.consumer.account.deleteAccount.errors[result.errorCode]);
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<button type="button" className="text-sm font-semibold text-destructive" />}
      >
        {t.consumer.account.deleteAccount.button}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.consumer.account.deleteAccount.confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.consumer.account.deleteAccount.confirmDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.consumer.account.deleteAccount.cancelButton}</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
            onClick={handleConfirm}
          >
            {t.consumer.account.deleteAccount.confirmButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

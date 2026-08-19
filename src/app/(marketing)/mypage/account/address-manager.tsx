'use client';

import { useState, useTransition } from 'react';

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useT } from '@/hooks/use-t';
import type { Tables } from '@/lib/db/database.types';

import { deleteAddress } from './address-actions';
import { AddressForm } from './address-form';

interface AddressManagerProps {
  addresses: Tables<'addresses'>[];
}

export function AddressManager({ addresses }: AddressManagerProps) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteAddress(id);
      if (result) {
        toast.error(t.consumer.account.shippingAddress.errors[result.errorCode]);
      }
    });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-foreground">
          {t.consumer.account.shippingAddress.title}
        </h2>
        <Dialog
          open={openDialogId === 'new'}
          onOpenChange={(open) => setOpenDialogId(open ? 'new' : null)}
        >
          <DialogTrigger
            render={<button type="button" className="text-sm font-semibold text-primary" />}
          >
            {t.consumer.account.shippingAddress.addButton}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.consumer.account.shippingAddress.addTitle}</DialogTitle>
            </DialogHeader>
            <AddressForm onSuccess={() => setOpenDialogId(null)} />
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.consumer.account.shippingAddress.empty}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={
                address.is_default
                  ? 'flex flex-col gap-1 rounded-md border border-border bg-muted p-4'
                  : 'flex flex-col gap-1 rounded-md border border-border bg-card p-4'
              }
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {address.is_default
                    ? `${t.consumer.account.shippingAddress.defaultLabel} (${address.label})`
                    : address.label}
                </span>
                <span className="flex gap-3 text-xs">
                  <Dialog
                    open={openDialogId === address.id}
                    onOpenChange={(open) => setOpenDialogId(open ? address.id : null)}
                  >
                    <DialogTrigger
                      render={<button type="button" className="text-muted-foreground" />}
                    >
                      {t.consumer.account.shippingAddress.editLink}
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t.consumer.account.shippingAddress.editTitle}</DialogTitle>
                      </DialogHeader>
                      <AddressForm
                        addressId={address.id}
                        defaultValues={{
                          label: address.label,
                          recipientName: address.recipient_name,
                          phone: address.phone,
                          postalCode: address.postal_code,
                          addressLine1: address.address_line1,
                          addressLine2: address.address_line2 ?? '',
                          isDefault: address.is_default,
                        }}
                        onSuccess={() => setOpenDialogId(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={<button type="button" className="text-destructive" />}
                    >
                      {t.consumer.account.shippingAddress.deleteLink}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t.consumer.account.shippingAddress.deleteConfirmTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t.consumer.account.shippingAddress.deleteConfirmDescription}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {t.consumer.account.shippingAddress.form.cancelButton}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          disabled={isPending}
                          onClick={() => handleDelete(address.id)}
                        >
                          {t.consumer.account.shippingAddress.deleteLink}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                [{address.postal_code}] {address.address_line1}
                {address.address_line2 ? ` ${address.address_line2}` : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useT } from '@/hooks/use-t';

import { updateDisplayName } from './actions';
import { type DisplayNameInput, displayNameSchema } from './display-name-schema';

interface DisplayNameFormProps {
  currentName: string;
}

export function DisplayNameForm({ currentName }: DisplayNameFormProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DisplayNameInput>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: { displayName: currentName },
  });

  function onSubmit(values: DisplayNameInput) {
    startTransition(async () => {
      const result = await updateDisplayName(values);
      if (result) {
        toast.error(t.consumer.account.errors[result.errorCode]);
        return;
      }

      toast.success(t.consumer.account.personalInfo.updateSuccess);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<button type="button" className="text-sm text-primary" />}>
        {t.consumer.account.personalInfo.editLink}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.consumer.account.personalInfo.editNameTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-2">
            <Label htmlFor="display-name">{t.consumer.account.personalInfo.nameLabel}</Label>
            <Input id="display-name" {...register('displayName')} />
            {errors.displayName ? (
              <p className="text-sm text-destructive">
                {t.consumer.account.personalInfo.nameInvalid}
              </p>
            ) : null}
          </div>
          <Button type="submit" variant="primary" disabled={isPending} className="w-fit">
            {isPending ? t.consumer.account.submitting : t.consumer.account.submitButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

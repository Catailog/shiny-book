'use client';

import type { ChangeEvent } from 'react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FILE_UPLOAD_KIND,
  FILE_UPLOAD_RULES,
  type FileUploadKind,
  STORAGE_BUCKETS,
} from '@/constants/file-upload';
import { useT } from '@/hooks/use-t';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client';
import { createSignedUploadUrl } from '@/lib/uploads/create-signed-upload-url';
import { processCoverImage } from '@/lib/uploads/process-cover-image';

import { createConsumerOrder } from './actions';
import { type OrderDetailsInput, orderDetailsSchema } from './order-schema';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

async function uploadRawFile(kind: FileUploadKind, file: File): Promise<string | null> {
  const rule = FILE_UPLOAD_RULES[kind];
  if (!rule.allowedMimeTypes.includes(file.type) || file.size > rule.maxSizeBytes) {
    return null;
  }

  const signed = await createSignedUploadUrl({
    kind,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
  });
  if (!signed.success) {
    return null;
  }

  const supabase = createBrowserSupabaseClient();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.ORDER_UPLOADS)
    .uploadToSignedUrl(signed.path, signed.token, file);

  return error ? null : signed.path;
}

export function ConsumerOrderForm() {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [manuscriptPath, setManuscriptPath] = useState<string | null>(null);
  const [coverPath, setCoverPath] = useState<string | null>(null);
  const [manuscriptStatus, setManuscriptStatus] = useState<UploadStatus>('idle');
  const [coverStatus, setCoverStatus] = useState<UploadStatus>('idle');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderDetailsInput>({ resolver: zodResolver(orderDetailsSchema) });

  async function handleManuscriptChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setManuscriptStatus('uploading');
    const path = await uploadRawFile(FILE_UPLOAD_KIND.MANUSCRIPT, file);
    if (!path) {
      setManuscriptPath(null);
      setManuscriptStatus('error');
      toast.error(t.consumer.orderNew.errors.uploadFailed);
      return;
    }

    setManuscriptPath(path);
    setManuscriptStatus('done');
  }

  async function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setCoverStatus('uploading');
    const rawPath = await uploadRawFile(FILE_UPLOAD_KIND.COVER, file);
    if (!rawPath) {
      setCoverPath(null);
      setCoverStatus('error');
      toast.error(t.consumer.orderNew.errors.uploadFailed);
      return;
    }

    setCoverStatus('processing');
    const processed = await processCoverImage(rawPath);
    if (!processed.success) {
      setCoverPath(null);
      setCoverStatus('error');
      toast.error(t.consumer.orderNew.errors.uploadFailed);
      return;
    }

    setCoverPath(processed.path);
    setCoverStatus('done');
  }

  function onSubmit(values: OrderDetailsInput) {
    if (!manuscriptPath || !coverPath) {
      toast.error(t.consumer.orderNew.errors.filesRequired);
      return;
    }

    startTransition(async () => {
      const result = await createConsumerOrder({
        title: values.title,
        quantity: values.quantity,
        couponCode: values.couponCode,
        manuscriptPath,
        coverPath,
      });
      if (result) {
        toast.error(t.consumer.orderNew.errors[result.errorCode]);
      }
    });
  }

  const uploadStatusLabel: Record<UploadStatus, string> = {
    idle: '',
    uploading: t.consumer.orderNew.status.uploading,
    processing: t.consumer.orderNew.status.processing,
    done: t.consumer.orderNew.status.done,
    error: t.consumer.orderNew.errors.uploadFailed,
  };

  const isSubmitDisabled =
    isPending ||
    manuscriptStatus !== 'done' ||
    coverStatus !== 'done' ||
    manuscriptPath === null ||
    coverPath === null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">{t.consumer.orderNew.titleLabel}</Label>
        <Input id="title" type="text" {...register('title')} />
        {errors.title ? (
          <p className="text-sm text-destructive">{t.consumer.orderNew.errors.titleRequired}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="quantity">{t.consumer.orderNew.quantityLabel}</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          step={1}
          {...register('quantity', { valueAsNumber: true })}
        />
        {errors.quantity ? (
          <p className="text-sm text-destructive">{t.consumer.orderNew.errors.quantityInvalid}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="manuscript">{t.consumer.orderNew.manuscriptLabel}</Label>
        <Input
          id="manuscript"
          type="file"
          accept="application/pdf"
          onChange={(event) => void handleManuscriptChange(event)}
        />
        {manuscriptStatus !== 'idle' ? (
          <p className="text-sm text-muted-foreground">{uploadStatusLabel[manuscriptStatus]}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cover">{t.consumer.orderNew.coverLabel}</Label>
        <Input
          id="cover"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => void handleCoverChange(event)}
        />
        {coverStatus !== 'idle' ? (
          <p className="text-sm text-muted-foreground">{uploadStatusLabel[coverStatus]}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="couponCode">{t.consumer.orderNew.couponLabel}</Label>
        <Input id="couponCode" type="text" {...register('couponCode')} />
      </div>
      <Button type="submit" disabled={isSubmitDisabled} className="w-full">
        {isPending ? t.consumer.orderNew.submitting : t.consumer.orderNew.submitButton}
      </Button>
    </form>
  );
}

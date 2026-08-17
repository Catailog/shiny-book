'use client';

import type { ChangeEvent } from 'react';
import { useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
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
import { PRICING } from '@/constants/pricing';
import { useT } from '@/hooks/use-t';
import type { Tables } from '@/lib/db/database.types';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client';
import { createSignedUploadUrl } from '@/lib/uploads/create-signed-upload-url';
import { processCoverImage } from '@/lib/uploads/process-cover-image';
import { cn } from '@/lib/utils';

import { createConsumerOrder } from './actions';
import { type OrderDetailsInput, orderDetailsSchema } from './order-schema';

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

interface NewOrderWizardProps {
  products: Tables<'products'>[];
}

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

export function NewOrderWizard({ products }: NewOrderWizardProps) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(products[0]?.slug ?? null);
  const [manuscriptPath, setManuscriptPath] = useState<string | null>(null);
  const [coverPath, setCoverPath] = useState<string | null>(null);
  const [manuscriptStatus, setManuscriptStatus] = useState<UploadStatus>('idle');
  const [coverStatus, setCoverStatus] = useState<UploadStatus>('idle');
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrderDetailsInput>({
    resolver: zodResolver(orderDetailsSchema),
    defaultValues: { title: products[0]?.name ?? '', quantity: 1 },
  });
  const quantity = useWatch({ control, name: 'quantity' }) || 0;
  const totalAmount = quantity * PRICING.BOOK_UNIT_PRICE_KRW;

  function handleSelectProduct(product: Tables<'products'>) {
    setSelectedSlug(product.slug);
    setValue('title', product.name);
  }

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6" noValidate>
      <div className="flex flex-1 flex-col gap-10">
        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {t.consumer.orderNew.productStep.heading}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelectProduct(product)}
                className={cn(
                  'flex flex-col gap-3 rounded-md border p-4 text-left transition-colors',
                  selectedSlug === product.slug
                    ? 'border-primary bg-primary-soft'
                    : 'border-border bg-card hover:border-primary/50',
                )}
              >
                <div className="relative h-25 w-full overflow-hidden rounded bg-muted">
                  <Image
                    src={product.image_url}
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-heading text-lg font-bold text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.size}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">{t.consumer.orderNew.titleLabel}</Label>
            <Input id="title" type="text" {...register('title')} />
            {errors.title ? (
              <p className="text-sm text-destructive">{t.consumer.orderNew.errors.titleRequired}</p>
            ) : null}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {t.consumer.orderNew.uploadStep.heading}
          </h2>
          <div className="flex flex-col gap-2 rounded-lg border border-primary bg-muted px-4 py-6">
            <Upload aria-hidden="true" className="size-6 text-primary" />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="manuscript">{t.consumer.orderNew.manuscriptLabel}</Label>
              <Input
                id="manuscript"
                type="file"
                accept="application/pdf"
                onChange={(event) => void handleManuscriptChange(event)}
              />
              {manuscriptStatus !== 'idle' ? (
                <p className="text-xs text-muted-foreground">
                  {uploadStatusLabel[manuscriptStatus]}
                </p>
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
                <p className="text-xs text-muted-foreground">{uploadStatusLabel[coverStatus]}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {t.consumer.orderNew.detailsStep.heading}
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity">{t.consumer.orderNew.quantityLabel}</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                step={1}
                {...register('quantity', { valueAsNumber: true })}
              />
              {errors.quantity ? (
                <p className="text-sm text-destructive">
                  {t.consumer.orderNew.errors.quantityInvalid}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="couponCode">{t.consumer.orderNew.couponLabel}</Label>
              <Input id="couponCode" type="text" {...register('couponCode')} />
            </div>
          </div>
        </section>
      </div>

      <div className="w-95 shrink-0 rounded-lg border border-border bg-muted p-6">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {t.consumer.orderNew.summary.title}
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.consumer.orderNew.summary.shipping}</span>
              <span className="text-foreground">{t.consumer.orderNew.summary.shippingFree}</span>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xl font-bold text-foreground">
                {t.consumer.orderNew.summary.finalEstimate}
              </span>
              <span className="font-heading text-2xl font-bold text-primary">
                ₩{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? t.consumer.orderNew.submitting : t.consumer.orderNew.summary.payButton}
          </Button>
        </div>
      </div>
    </form>
  );
}

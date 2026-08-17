'use client';

import type { ChangeEvent } from 'react';
import { useState, useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  FILE_UPLOAD_KIND,
  FILE_UPLOAD_RULES,
  type FileUploadKind,
  STORAGE_BUCKETS,
} from '@/constants/file-upload';
import {
  PHOTOBOOK_PAGE_COUNT_MIN,
  PHOTOBOOK_PAGE_COUNT_OPTIONS,
  PHOTOBOOK_PHOTOS_PER_PAGE,
} from '@/constants/photobook';
import { PRICING } from '@/constants/pricing';
import { useT } from '@/hooks/use-t';
import type { Tables } from '@/lib/db/database.types';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client';
import { createSignedUploadUrl } from '@/lib/uploads/create-signed-upload-url';
import { processOrderPhoto } from '@/lib/uploads/process-order-photo';

import { createConsumerOrder } from './actions';
import {
  type OrderDetailsInput,
  createConsumerOrderSchema,
  orderDetailsSchema,
} from './order-schema';
import { generateTestPhotos } from './test-photo-actions';

type UploadStatus = 'uploading' | 'processing' | 'done' | 'error';
type Phase = 'details' | 'photos';

interface PhotoItem {
  id: string;
  previewUrl: string | null;
  path: string | null;
  status: UploadStatus;
}

interface NewOrderWizardProps {
  product: Tables<'products'>;
  allowTestUpload: boolean;
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

export function NewOrderWizard({ product, allowTestUpload }: NewOrderWizardProps) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [isGeneratingTestPhotos, startTestPhotosTransition] = useTransition();
  const [phase, setPhase] = useState<Phase>('details');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const {
    register,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OrderDetailsInput>({
    resolver: zodResolver(orderDetailsSchema),
    defaultValues: {
      productId: product.id,
      title: '',
      quantity: 1,
      pageCount: PHOTOBOOK_PAGE_COUNT_MIN,
      couponCode: '',
    },
  });
  const title = useWatch({ control, name: 'title' });
  const quantity = useWatch({ control, name: 'quantity' }) || 0;
  const pageCount = useWatch({ control, name: 'pageCount' }) || PHOTOBOOK_PAGE_COUNT_MIN;
  const requiredPhotoCount = pageCount * PHOTOBOOK_PHOTOS_PER_PAGE;
  const totalAmount = (product.price + pageCount * PRICING.PRICE_PER_PAGE_KRW) * quantity;
  const donePhotoCount = photos.filter((photo) => photo.status === 'done').length;

  async function handleNext() {
    const isValid = await trigger(['title', 'quantity', 'pageCount']);
    if (isValid) {
      setPhase('photos');
    }
  }

  function handleEdit() {
    photos.forEach((photo) => {
      if (photo.previewUrl) {
        URL.revokeObjectURL(photo.previewUrl);
      }
    });
    setPhotos([]);
    setPhase('details');
  }

  async function handlePhotosChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) {
      return;
    }

    const pending = files.map((file) => ({
      id: crypto.randomUUID(),
      previewUrl: URL.createObjectURL(file),
      path: null as string | null,
      status: 'uploading' as UploadStatus,
      file,
    }));

    setPhotos((current) => [...current, ...pending]);

    for (const item of pending) {
      const rawPath = await uploadRawFile(FILE_UPLOAD_KIND.PHOTO, item.file);
      if (!rawPath) {
        setPhotos((current) =>
          current.map((photo) => (photo.id === item.id ? { ...photo, status: 'error' } : photo)),
        );
        toast.error(t.consumer.orderNew.errors.uploadFailed);
        continue;
      }

      setPhotos((current) =>
        current.map((photo) => (photo.id === item.id ? { ...photo, status: 'processing' } : photo)),
      );

      const processed = await processOrderPhoto(rawPath);
      if (!processed.success) {
        setPhotos((current) =>
          current.map((photo) => (photo.id === item.id ? { ...photo, status: 'error' } : photo)),
        );
        toast.error(t.consumer.orderNew.errors.uploadFailed);
        continue;
      }

      setPhotos((current) =>
        current.map((photo) =>
          photo.id === item.id ? { ...photo, path: processed.path, status: 'done' } : photo,
        ),
      );
    }
  }

  function handleRemovePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((photo) => photo.id !== id);
    });
  }

  function handleGenerateTestPhotos() {
    startTestPhotosTransition(async () => {
      const result = await generateTestPhotos(requiredPhotoCount);
      if (!result.success) {
        toast.error(t.consumer.orderNew.errors.uploadFailed);
        return;
      }

      photos.forEach((photo) => {
        if (photo.previewUrl) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
      setPhotos(
        result.paths.map((path) => ({
          id: crypto.randomUUID(),
          previewUrl: null,
          path,
          status: 'done',
        })),
      );
    });
  }

  function handleSubmit() {
    const values = getValues();
    const photoPaths = photos
      .filter((photo) => photo.status === 'done' && photo.path)
      .map((photo) => photo.path as string);

    const parsed = createConsumerOrderSchema.safeParse({ ...values, photoPaths });
    if (!parsed.success) {
      const issueField = parsed.error.issues[0]?.path[0];
      if (issueField === 'title') {
        toast.error(t.consumer.orderNew.errors.titleRequired);
      } else if (issueField === 'quantity') {
        toast.error(t.consumer.orderNew.errors.quantityInvalid);
      } else if (issueField === 'pageCount') {
        toast.error(t.consumer.orderNew.errors.pageCountInvalid);
      } else {
        toast.error(t.consumer.orderNew.errors.photoCountMismatch);
      }
      return;
    }

    startTransition(async () => {
      const result = await createConsumerOrder(parsed.data);
      if (result) {
        toast.error(t.consumer.orderNew.errors[result.errorCode]);
      }
    });
  }

  return (
    <div className="flex gap-6">
      <div className="flex flex-1 flex-col gap-10">
        <section className="flex items-center gap-5 rounded-lg border border-border bg-card p-5">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              {t.consumer.orderNew.productLabel}
            </p>
            <p className="font-heading text-2xl font-bold text-foreground">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.size}</p>
          </div>
        </section>

        {phase === 'details' ? (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">{t.consumer.orderNew.titleLabel}</Label>
              <Input
                id="title"
                type="text"
                placeholder={t.consumer.orderNew.titlePlaceholder}
                {...register('title')}
              />
              {errors.title ? (
                <p className="text-sm text-destructive">
                  {t.consumer.orderNew.errors.titleRequired}
                </p>
              ) : null}
            </div>
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
                <Label htmlFor="pageCount">{t.consumer.orderNew.pageCountLabel}</Label>
                <Controller
                  control={control}
                  name="pageCount"
                  render={({ field }) => (
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger id="pageCount" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PHOTOBOOK_PAGE_COUNT_OPTIONS.map((option) => (
                          <SelectItem key={option} value={String(option)}>
                            {option}p
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="primary"
              className="w-fit"
              onClick={() => void handleNext()}
            >
              {t.consumer.orderNew.nextButton}
            </Button>
          </section>
        ) : (
          <>
            <section className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted p-5">
              <div className="flex flex-col gap-1">
                <p className="font-heading text-lg font-bold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">
                  {t.consumer.orderNew.quantityLabel} {quantity} /{' '}
                  {t.consumer.orderNew.summary.pageCountLine.replace(
                    '{pageCount}',
                    String(pageCount),
                  )}
                </p>
              </div>
              <Button type="button" variant="outline" onClick={handleEdit}>
                {t.consumer.orderNew.editButton}
              </Button>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label>{t.consumer.orderNew.photosLabel}</Label>
                  {allowTestUpload ? (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <button
                            type="button"
                            disabled={isGeneratingTestPhotos}
                            onClick={handleGenerateTestPhotos}
                            className={buttonVariants({ variant: 'outline', size: 'xs' })}
                          />
                        }
                      >
                        {t.consumer.orderNew.testUploadButton}
                      </TooltipTrigger>
                      <TooltipContent>{t.consumer.orderNew.testUploadTooltip}</TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t.consumer.orderNew.photosHint
                    .replace('{count}', String(donePhotoCount))
                    .replace('{required}', String(requiredPhotoCount))}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
                  >
                    {photo.previewUrl ? (
                      <Image
                        src={photo.previewUrl}
                        alt=""
                        fill
                        sizes="160px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                        {t.consumer.orderNew.testUploadButton}
                      </div>
                    )}
                    {photo.status !== 'done' ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-xs text-foreground">
                        {photo.status === 'error'
                          ? t.consumer.orderNew.errors.uploadFailed
                          : t.consumer.orderNew.status[photo.status]}
                      </div>
                    ) : null}
                    <button
                      type="button"
                      aria-label={t.consumer.orderNew.removePhotoLabel}
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground"
                    >
                      <X aria-hidden="true" className="size-3.5" />
                    </button>
                  </div>
                ))}
                <label
                  htmlFor="photos"
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-primary text-primary hover:bg-primary-soft"
                >
                  <ImagePlus aria-hidden="true" className="size-6" />
                  <span className="text-xs font-semibold">
                    {t.consumer.orderNew.addPhotosButton}
                  </span>
                </label>
                <input
                  id="photos"
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(event) => void handlePhotosChange(event)}
                />
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <Label htmlFor="couponCode">{t.consumer.orderNew.couponLabel}</Label>
              <Input id="couponCode" type="text" {...register('couponCode')} />
            </section>
          </>
        )}
      </div>

      <div className="w-95 shrink-0 rounded-lg border border-border bg-muted p-6">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {t.consumer.orderNew.summary.title}
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t.consumer.orderNew.summary.pageCountLine.replace(
                  '{pageCount}',
                  String(pageCount),
                )}
              </span>
            </div>
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
          {phase === 'photos' ? (
            <Button
              type="button"
              variant="primary"
              disabled={isPending}
              className="w-full"
              onClick={handleSubmit}
            >
              {isPending ? t.consumer.orderNew.submitting : t.consumer.orderNew.summary.payButton}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import Image from 'next/image';
import Link from 'next/link';

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, RefreshCw, TriangleAlert, X } from 'lucide-react';
import { toast } from 'sonner';

import { CharCounterField } from '@/components/char-counter-field';
import { Coachmark, CoachmarkHighlight } from '@/components/coachmark';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { COUPON_CODE_MAX_LENGTH, TEST_COUPON_CODE } from '@/constants/coupon';
import {
  FILE_UPLOAD_KIND,
  FILE_UPLOAD_RULES,
  ORDER_PHOTO_PROCESS_CHUNK_SIZE,
  ORDER_PHOTO_UPLOAD_CONCURRENCY,
  ORDER_PHOTO_UPLOAD_RETRY_ATTEMPTS,
  ORDER_PHOTO_UPLOAD_RETRY_DELAY_MS,
  STORAGE_BUCKETS,
} from '@/constants/file-upload';
import { ORDER_QUANTITY_MAX, ORDER_TITLE_MAX_LENGTH } from '@/constants/order';
import {
  PHOTOBOOK_PAGE_COUNT_MIN,
  PHOTOBOOK_PAGE_COUNT_OPTIONS,
  PHOTOBOOK_PHOTOS_PER_PAGE,
} from '@/constants/photobook';
import { PRICING, SHIPPING } from '@/constants/pricing';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { TOAST_ID } from '@/constants/toast';
import { useErrorHighlight } from '@/hooks/use-error-highlight';
import { useT } from '@/hooks/use-t';
import type { Tables } from '@/lib/db/database.types';
import { calculateShippingFee } from '@/lib/orders/calculate-shipping-fee';
import type { OrderEditPrefill } from '@/lib/orders/get-order-edit-prefill';
import { runWithConcurrency } from '@/lib/run-with-concurrency';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client';
import { toastImportant } from '@/lib/toast';
import { createOrderPhotoUploadTickets } from '@/lib/uploads/create-order-photo-upload-tickets';
import { deleteOrderPhoto } from '@/lib/uploads/delete-order-photo';
import { processOrderPhotos } from '@/lib/uploads/process-order-photos';
import { cn } from '@/lib/utils';

import { createConsumerOrder } from './actions';
import { refreshAddresses } from './address-actions';
import {
  type OrderDetailsInput,
  createConsumerOrderSchema,
  orderDetailsSchema,
} from './order-schema';
import { generateTestPhotos } from './test-photo-actions';
import { updateConsumerOrder } from './update-order-actions';

type UploadStatus = 'queued' | 'uploading' | 'processing' | 'done' | 'error';
type Phase = 'details' | 'photos';

interface PhotoItem {
  id: string;
  previewUrl: string | null;
  path: string | null;
  status: UploadStatus;
  // Photos loaded from an order being edited are already saved - removing them here
  // should only drop them from this draft, not delete the file until the edit is
  // actually submitted (update-order-actions.ts replaces the saved photo set then).
  isExisting: boolean;
  // The picked File, kept so a failed upload can be retried. Absent for photos loaded
  // from an order being edited.
  file?: File;
}

interface NewOrderWizardProps {
  product: Tables<'products'>;
  addresses: Tables<'addresses'>[];
  allowTestUpload: boolean;
  initialValues: OrderEditPrefill | null;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let start = 0; start < items.length; start += size) {
    chunks.push(items.slice(start, start + size));
  }
  return chunks;
}

function isAllowedPhotoFile(file: File): boolean {
  const rule = FILE_UPLOAD_RULES[FILE_UPLOAD_KIND.PHOTO];
  return rule.allowedMimeTypes.includes(file.type) && file.size <= rule.maxSizeBytes;
}

// Pushes one file straight to Supabase Storage with a pre-minted ticket (client ->
// Storage, not a Server Action). Retries once on a transient failure; the signed upload
// token stays valid across a failed attempt.
async function uploadFileToStorage(
  ticket: { path: string; token: string },
  file: File,
): Promise<boolean> {
  const supabase = createBrowserSupabaseClient();
  for (let attempt = 0; attempt < ORDER_PHOTO_UPLOAD_RETRY_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await delay(ORDER_PHOTO_UPLOAD_RETRY_DELAY_MS);
    }
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS.ORDER_UPLOADS)
      .uploadToSignedUrl(ticket.path, ticket.token, file);
    if (!error) {
      return true;
    }
  }
  return false;
}

export function NewOrderWizard({
  product,
  addresses: initialAddresses,
  allowTestUpload,
  initialValues,
}: NewOrderWizardProps) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [isGeneratingTestPhotos, startTestPhotosTransition] = useTransition();
  const [isRefreshingAddresses, startAddressRefreshTransition] = useTransition();
  const [phase, setPhase] = useState<Phase>(initialValues ? 'photos' : 'details');
  const [photos, setPhotos] = useState<PhotoItem[]>(() =>
    (initialValues?.photos ?? []).map((photo) => ({
      id: crypto.randomUUID(),
      previewUrl: photo.previewUrl,
      path: photo.path,
      status: 'done',
      isExisting: true,
    })),
  );
  const [addresses, setAddresses] = useState(initialAddresses);
  // When photo processing is rate-limited, the timestamp the caller may retry at. The
  // `clockTick` state just forces a re-render each second so the countdown updates live.
  const [retryAllowedAt, setRetryAllowedAt] = useState<number | null>(null);
  const [clockTick, setClockTick] = useState(() => Date.now());
  const addressSectionRef = useRef<HTMLElement>(null);
  const photosSectionRef = useRef<HTMLElement>(null);
  const retryBarRef = useRef<HTMLDivElement>(null);
  const addressHighlight = useErrorHighlight();
  const photosHighlight = useErrorHighlight();
  const {
    register,
    control,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<OrderDetailsInput>({
    resolver: zodResolver(orderDetailsSchema),
    mode: 'onChange',
    defaultValues: {
      productId: product.id,
      title: initialValues?.title ?? '',
      quantity: initialValues?.quantity ?? 1,
      pageCount: initialValues?.pageCount ?? PHOTOBOOK_PAGE_COUNT_MIN,
      addressId:
        initialValues?.addressId ?? addresses.find((address) => address.is_default)?.id ?? '',
      couponCode: '',
    },
  });
  const title = useWatch({ control, name: 'title' });
  const quantityRaw = useWatch({ control, name: 'quantity' });
  const isQuantityValid = orderDetailsSchema.shape.quantity.safeParse(quantityRaw).success;
  const quantity = isQuantityValid ? quantityRaw : 0;
  const pageCount = useWatch({ control, name: 'pageCount' }) || PHOTOBOOK_PAGE_COUNT_MIN;
  const addressId = useWatch({ control, name: 'addressId' });
  const requiredPhotoCount = pageCount * PHOTOBOOK_PHOTOS_PER_PAGE;
  const isPhotoCountExceeded = photos.length > 0 && photos.length > requiredPhotoCount;
  const productAmount = product.price * quantity;
  const pageCountAmount = pageCount * PRICING.PRICE_PER_PAGE_KRW * quantity;
  const merchandiseAmount = productAmount + pageCountAmount;
  const selectedAddress = addresses.find((address) => address.id === addressId) ?? null;
  const shippingFee = selectedAddress
    ? calculateShippingFee(selectedAddress.postal_code, merchandiseAmount)
    : null;
  const isShippingFree = merchandiseAmount >= SHIPPING.FREE_SHIPPING_THRESHOLD_KRW;
  const shippingDisplay = isShippingFree
    ? t.consumer.orderNew.summary.shippingFree
    : shippingFee === null
      ? t.consumer.orderNew.summary.shippingUndetermined
      : `₩${shippingFee.toLocaleString()}`;
  const totalAmount = merchandiseAmount + (isShippingFree ? 0 : (shippingFee ?? 0));
  const donePhotoCount = photos.filter((photo) => photo.status === 'done').length;
  const retryablePhotoCount = photos.filter(
    (photo) => photo.status === 'error' && photo.file != null,
  ).length;
  const [photosHintBefore, photosHintAfter] = t.consumer.orderNew.photosHint
    .replace('{required}', String(requiredPhotoCount))
    .split('{count}');
  const isUploadingPhotos = photos.some(
    (photo) =>
      photo.status === 'queued' || photo.status === 'uploading' || photo.status === 'processing',
  );
  const retrySecondsLeft =
    retryAllowedAt !== null ? Math.max(0, Math.ceil((retryAllowedAt - clockTick) / 1000)) : 0;
  const isRetryRateLimited = retrySecondsLeft > 0;
  const photoDragSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // The "photo count exceeded" toast is fired with a stable id, so once the user
  // resolves it (removes photos or raises the page count) we dismiss it automatically.
  useEffect(() => {
    if (!isPhotoCountExceeded) {
      toast.dismiss(TOAST_ID.ORDER_PHOTO_COUNT_EXCEEDED);
    }
  }, [isPhotoCountExceeded]);

  // Tick the countdown while a retry is rate-limited; clear it once the wait is over.
  useEffect(() => {
    if (retryAllowedAt === null) {
      return;
    }
    const timer = setInterval(() => {
      if (Date.now() >= retryAllowedAt) {
        setRetryAllowedAt(null);
      } else {
        setClockTick(Date.now());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAllowedAt]);

  // Bring the countdown into view the moment a retry gets rate-limited.
  useEffect(() => {
    if (isRetryRateLimited) {
      retryBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isRetryRateLimited]);

  async function handleNext() {
    const isValid = await trigger(['title', 'quantity', 'pageCount']);
    if (!isValid) {
      return;
    }

    if (isPhotoCountExceeded) {
      toastImportant.error(
        t.consumer.orderNew.errors.photoCountExceeded
          .replace('{count}', String(photos.length))
          .replace('{required}', String(requiredPhotoCount)),
        t.common.importantToastLabel,
        { id: TOAST_ID.ORDER_PHOTO_COUNT_EXCEEDED },
      );
      return;
    }

    setPhase('photos');
  }

  function handleEdit() {
    setPhase('details');
  }

  function patchPhoto(id: string, patch: Partial<PhotoItem>) {
    setPhotos((current) =>
      current.map((photo) => (photo.id === id ? { ...photo, ...patch } : photo)),
    );
  }

  function patchPhotos(ids: Set<string>, patch: Partial<PhotoItem>) {
    setPhotos((current) =>
      current.map((photo) => (ids.has(photo.id) ? { ...photo, ...patch } : photo)),
    );
  }

  function notifyUploadFailed() {
    toast.error(t.consumer.orderNew.errors.uploadFailed, {
      id: TOAST_ID.ORDER_PHOTO_UPLOAD_FAILED,
    });
  }

  async function uploadPendingPhotos(pending: { id: string; file: File }[]) {
    // One Server Action mints all the signed upload URLs (Next.js runs Server Actions
    // sequentially and the proxy rate-limits them, so per-photo calls do not scale).
    const ticketResult = await createOrderPhotoUploadTickets(
      pending.map((item) => ({
        fileType: item.file.type,
        fileSize: item.file.size,
      })),
    ).catch(() => null);

    if (!ticketResult || !ticketResult.success) {
      patchPhotos(new Set(pending.map((item) => item.id)), { status: 'error' });
      notifyUploadFailed();
      return;
    }

    // Push the raw files straight to Storage in parallel - these are not Server Actions.
    const uploaded: { id: string; rawPath: string }[] = [];
    await runWithConcurrency(pending, ORDER_PHOTO_UPLOAD_CONCURRENCY, async (item, index) => {
      const ticket = ticketResult.tickets[index];
      if (!ticket) {
        patchPhoto(item.id, { status: 'error' });
        notifyUploadFailed();
        return;
      }
      patchPhoto(item.id, { status: 'uploading' });
      const ok = await uploadFileToStorage(ticket, item.file);
      if (!ok) {
        patchPhoto(item.id, { status: 'error' });
        notifyUploadFailed();
        return;
      }
      patchPhoto(item.id, { status: 'processing' });
      uploaded.push({ id: item.id, rawPath: ticket.path });
    });

    if (uploaded.length === 0) {
      return;
    }

    // Process the uploaded photos in chunks - one Server Action per chunk keeps each
    // request short and lets progress update as chunks finish.
    const chunks = chunkArray(uploaded, ORDER_PHOTO_PROCESS_CHUNK_SIZE);
    for (const [chunkIndex, group] of chunks.entries()) {
      const processResult = await processOrderPhotos(group.map((entry) => entry.rawPath)).catch(
        () => null,
      );

      if (!processResult || !processResult.success) {
        if (processResult?.errorCode === 'rate_limited') {
          // This chunk and every one after it are blocked by the same limit.
          const blockedIds = new Set(
            chunks.slice(chunkIndex).flatMap((remaining) => remaining.map((entry) => entry.id)),
          );
          patchPhotos(blockedIds, { status: 'error' });
          setRetryAllowedAt(Date.now() + (processResult.retryAfterSeconds ?? 60) * 1000);
          return;
        }
        patchPhotos(new Set(group.map((entry) => entry.id)), { status: 'error' });
        notifyUploadFailed();
        continue;
      }

      const donePaths = new Map(
        processResult.results
          .filter((entry): entry is { rawPath: string; processedPath: string } =>
            Boolean(entry.processedPath),
          )
          .map((entry) => [entry.rawPath, entry.processedPath]),
      );
      setPhotos((current) =>
        current.map((photo) => {
          const entry = group.find((candidate) => candidate.id === photo.id);
          if (!entry) {
            return photo;
          }
          const processedPath = donePaths.get(entry.rawPath);
          return processedPath
            ? { ...photo, status: 'done', path: processedPath }
            : { ...photo, status: 'error' };
        }),
      );
      if (donePaths.size < group.length) {
        notifyUploadFailed();
      }
    }
  }

  function handleRetryFailedPhotos() {
    const failed = photos.filter(
      (photo): photo is PhotoItem & { file: File } =>
        photo.status === 'error' && photo.file != null,
    );
    if (failed.length === 0) {
      return;
    }
    setRetryAllowedAt(null);

    // Only retry up to what the current page count leaves room for; the rest stay as
    // failed tiles until the user makes more room.
    const occupiedSlots = photos.filter((photo) => photo.status !== 'error').length;
    const capacity = Math.max(0, requiredPhotoCount - occupiedSlots);
    const toRetry = failed.slice(0, capacity);
    const stillOverCapacity = failed.length - toRetry.length;

    if (stillOverCapacity > 0) {
      toastImportant.warning(
        t.consumer.orderNew.errors.photosSkippedOverLimit
          .replace('{skipped}', String(stillOverCapacity))
          .replace('{required}', String(requiredPhotoCount)),
        t.common.importantToastLabel,
        { id: TOAST_ID.ORDER_PHOTO_COUNT_EXCEEDED },
      );
    }
    if (toRetry.length === 0) {
      return;
    }

    patchPhotos(new Set(toRetry.map((photo) => photo.id)), { status: 'queued', path: null });
    void uploadPendingPhotos(toRetry.map((photo) => ({ id: photo.id, file: photo.file })));
  }

  async function handlePhotosChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (selected.length === 0) {
      return;
    }

    const validFiles = selected.filter(isAllowedPhotoFile);
    if (validFiles.length < selected.length) {
      notifyUploadFailed();
    }
    if (validFiles.length === 0) {
      return;
    }

    // Everything gets a tile, but only what fits the current page count is uploaded now.
    // The overflow sits as a failed tile the user can retry after making room (raising
    // the page count or removing photos).
    const remainingCapacity = Math.max(0, requiredPhotoCount - photos.length);
    const pending = validFiles.map((file, index) => ({
      id: crypto.randomUUID(),
      previewUrl: URL.createObjectURL(file),
      path: null as string | null,
      status: (index < remainingCapacity ? 'queued' : 'error') as UploadStatus,
      isExisting: false,
      file,
    }));

    setPhotos((current) => [...current, ...pending]);

    const overCapacity = pending.filter((item) => item.status === 'error');
    if (overCapacity.length > 0) {
      toastImportant.warning(
        t.consumer.orderNew.errors.photosSkippedOverLimit
          .replace('{skipped}', String(overCapacity.length))
          .replace('{required}', String(requiredPhotoCount)),
        t.common.importantToastLabel,
        { id: TOAST_ID.ORDER_PHOTO_COUNT_EXCEEDED },
      );
      photosHighlight.trigger(photosSectionRef.current);
    }

    const toUpload = pending.filter((item) => item.status === 'queued');
    if (toUpload.length > 0) {
      await uploadPendingPhotos(toUpload.map((item) => ({ id: item.id, file: item.file })));
    }
  }

  function handlePhotoDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    setPhotos((current) => {
      const oldIndex = current.findIndex((photo) => photo.id === active.id);
      const newIndex = current.findIndex((photo) => photo.id === over.id);
      if (oldIndex === -1 || newIndex === -1) {
        return current;
      }
      return arrayMove(current, oldIndex, newIndex);
    });
  }

  function handleRemovePhoto(id: string) {
    const target = photos.find((photo) => photo.id === id);
    if (target?.previewUrl) {
      URL.revokeObjectURL(target.previewUrl);
    }
    if (target?.path && !target.isExisting) {
      void deleteOrderPhoto(target.path);
    }
    setPhotos((current) => current.filter((photo) => photo.id !== id));
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
        result.photos.map((photo) => ({
          id: crypto.randomUUID(),
          previewUrl: photo.previewUrl,
          path: photo.path,
          status: 'done',
          isExisting: false,
        })),
      );
    });
  }

  function handleRefreshAddresses() {
    startAddressRefreshTransition(async () => {
      const nextAddresses = await refreshAddresses();
      setAddresses(nextAddresses);

      const currentAddressId = getValues('addressId');
      const stillExists = nextAddresses.some((address) => address.id === currentAddressId);
      if (!stillExists) {
        setValue('addressId', nextAddresses.find((address) => address.is_default)?.id ?? '');
      }
    });
  }

  function handleFillTestCoupon() {
    setValue('couponCode', TEST_COUPON_CODE);
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
      } else if (issueField === 'couponCode') {
        toast.error(t.consumer.orderNew.errors.couponTooLong);
      } else if (issueField === 'addressId') {
        toast.error(t.consumer.orderNew.errors.addressRequired);
        addressHighlight.trigger(addressSectionRef.current);
      } else {
        toast.error(t.consumer.orderNew.errors.photoCountMismatch);
        photosHighlight.trigger(photosSectionRef.current);
      }
      return;
    }

    startTransition(async () => {
      const result = initialValues
        ? await updateConsumerOrder(initialValues.orderId, parsed.data)
        : await createConsumerOrder(parsed.data);
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
                maxLength={ORDER_TITLE_MAX_LENGTH}
                placeholder={t.consumer.orderNew.titlePlaceholder}
                {...register('title')}
              />
              <CharCounterField control={control} name="title" max={ORDER_TITLE_MAX_LENGTH} />
              {errors.title ? (
                <p className="text-sm text-destructive">
                  {errors.title.type === 'too_big'
                    ? t.consumer.orderNew.errors.titleTooLong
                    : errors.title.type === 'invalid_string'
                      ? t.consumer.orderNew.errors.titleInvalidChars
                      : t.consumer.orderNew.errors.titleRequired}
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
                  max={ORDER_QUANTITY_MAX}
                  step={1}
                  onKeyDown={(event) => {
                    if (['e', 'E', '+', '-'].includes(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  {...register('quantity', { valueAsNumber: true })}
                />
                {errors.quantity ? (
                  <p className="text-sm text-destructive">
                    {errors.quantity.type === 'too_big'
                      ? t.consumer.orderNew.errors.quantityTooLarge.replace(
                          '{max}',
                          String(ORDER_QUANTITY_MAX),
                        )
                      : t.consumer.orderNew.errors.quantityInvalid}
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
                {isPhotoCountExceeded ? (
                  <p className="text-sm text-destructive">
                    {t.consumer.orderNew.errors.photoCountExceeded
                      .replace('{count}', String(photos.length))
                      .replace('{required}', String(requiredPhotoCount))}
                  </p>
                ) : null}
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

            <section ref={photosSectionRef} className="relative flex flex-col gap-4">
              {photosHighlight.isHighlighted ? (
                <CoachmarkHighlight radiusClassName="rounded-lg" autoBorderRadius={null} />
              ) : null}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label>{t.consumer.orderNew.photosLabel}</Label>
                  {allowTestUpload ? (
                    <Coachmark
                      id="test-upload-photos"
                      title={t.consumer.orderNew.coachmarkTestUploadTitle}
                      description={t.consumer.orderNew.coachmarkTestUploadDescription}
                      closeLabel={t.common.coachmarkClose}
                    >
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <button
                              type="button"
                              disabled={isGeneratingTestPhotos}
                              onClick={handleGenerateTestPhotos}
                              className={buttonVariants({ variant: 'primary', size: 'xs' })}
                            />
                          }
                        >
                          {isGeneratingTestPhotos ? (
                            <RefreshCw aria-hidden="true" className="size-3.5 animate-spin" />
                          ) : null}
                          {t.consumer.orderNew.testUploadButton}
                        </TooltipTrigger>
                        <TooltipContent>{t.consumer.orderNew.testUploadTooltip}</TooltipContent>
                      </Tooltip>
                    </Coachmark>
                  ) : null}
                </div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm text-muted-foreground">
                    {photosHintBefore}
                    <span className={isPhotoCountExceeded ? 'text-destructive' : undefined}>
                      {donePhotoCount}
                    </span>
                    {photosHintAfter}
                  </p>
                  {isPhotoCountExceeded ? (
                    <Tooltip>
                      <TooltipTrigger
                        render={<button type="button" aria-label={t.common.warning} />}
                      >
                        <TriangleAlert
                          aria-hidden="true"
                          className="size-4 shrink-0 text-destructive"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {t.consumer.orderNew.errors.photoCountExceeded
                          .replace('{count}', String(photos.length))
                          .replace('{required}', String(requiredPhotoCount))}
                      </TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              </div>
              {retryablePhotoCount > 0 ? (
                <div
                  ref={retryBarRef}
                  className="flex items-center justify-between gap-3 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-2.5"
                >
                  <p className="text-sm text-destructive">
                    {isRetryRateLimited
                      ? t.consumer.orderNew.photosRateLimited.replace(
                          '{seconds}',
                          String(retrySecondsLeft),
                        )
                      : t.consumer.orderNew.photosRetryNotice.replace(
                          '{count}',
                          String(retryablePhotoCount),
                        )}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploadingPhotos || isRetryRateLimited}
                    onClick={handleRetryFailedPhotos}
                  >
                    {t.consumer.orderNew.photosRetryButton}
                  </Button>
                </div>
              ) : null}
              <DndContext
                sensors={photoDragSensors}
                collisionDetection={closestCenter}
                onDragEnd={handlePhotoDragEnd}
              >
                <SortableContext
                  items={photos.map((photo) => photo.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <SortablePhotoItem
                        key={photo.id}
                        photo={photo}
                        index={index}
                        placeholderLabel={t.consumer.orderNew.testUploadButton}
                        removeLabel={t.consumer.orderNew.removePhotoLabel}
                        statusLabel={
                          photo.status === 'done' ? null : t.consumer.orderNew.status[photo.status]
                        }
                        onRemove={handleRemovePhoto}
                      />
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
                </SortableContext>
              </DndContext>
            </section>

            <section ref={addressSectionRef} className="relative flex flex-col gap-3">
              {addressHighlight.isHighlighted ? (
                <CoachmarkHighlight radiusClassName="rounded-lg" autoBorderRadius={null} />
              ) : null}
              <div className="flex items-center justify-between">
                <Label>{t.consumer.orderNew.addressLabel}</Label>
                <div className="flex items-center gap-4">
                  <Link
                    href={CONSUMER_ROUTES.ACCOUNT}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-primary underline"
                  >
                    {addresses.length === 0
                      ? t.consumer.orderNew.addAddressLink
                      : t.consumer.orderNew.manageAddressLink}
                  </Link>
                  <button
                    type="button"
                    disabled={isRefreshingAddresses}
                    onClick={handleRefreshAddresses}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <RefreshCw
                      aria-hidden="true"
                      className={isRefreshingAddresses ? 'size-3.5 animate-spin' : 'size-3.5'}
                    />
                    {t.consumer.orderNew.refreshAddressesButton}
                  </button>
                </div>
              </div>
              {addresses.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
                  {t.consumer.orderNew.addressEmpty}
                </p>
              ) : (
                <Controller
                  control={control}
                  name="addressId"
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      {addresses.map((address) => (
                        <label
                          key={address.id}
                          htmlFor={`address-${address.id}`}
                          className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-input-background p-4 has-data-checked:border-primary"
                        >
                          <RadioGroupItem
                            id={`address-${address.id}`}
                            value={address.id}
                            className="mt-1"
                          />
                          <div className="flex flex-col gap-0.5 text-sm">
                            <span className="font-semibold text-foreground">
                              {address.label}
                              {address.is_default
                                ? ` (${t.consumer.account.shippingAddress.defaultLabel})`
                                : ''}
                            </span>
                            <span className="text-muted-foreground">
                              [{address.postal_code}] {address.address_line1}
                              {address.address_line2 ? ` ${address.address_line2}` : ''}
                            </span>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  )}
                />
              )}
            </section>

            {initialValues?.couponApplied ? (
              <p className="text-sm text-muted-foreground">
                {t.consumer.orderNew.couponLockedNote}
              </p>
            ) : (
              <section className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Label htmlFor="couponCode">{t.consumer.orderNew.couponLabel}</Label>
                  {allowTestUpload ? (
                    <Coachmark
                      id="test-fill-coupon"
                      title={t.consumer.orderNew.coachmarkTestCouponTitle}
                      description={t.consumer.orderNew.coachmarkTestCouponDescription}
                      closeLabel={t.common.coachmarkClose}
                    >
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <button
                              type="button"
                              onClick={handleFillTestCoupon}
                              className={buttonVariants({ variant: 'primary', size: 'xs' })}
                            />
                          }
                        >
                          {t.consumer.orderNew.testCouponButton}
                        </TooltipTrigger>
                        <TooltipContent>{t.consumer.orderNew.testCouponTooltip}</TooltipContent>
                      </Tooltip>
                    </Coachmark>
                  ) : null}
                </div>
                <Input
                  id="couponCode"
                  type="text"
                  maxLength={COUPON_CODE_MAX_LENGTH}
                  {...register('couponCode')}
                />
              </section>
            )}

            {isUploadingPhotos ? (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="primary"
                      className="pointer-events-auto w-full cursor-not-allowed opacity-50"
                    />
                  }
                >
                  {t.consumer.orderNew.summary.payButton}
                </TooltipTrigger>
                <TooltipContent>{t.consumer.orderNew.uploadingTooltip}</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                type="button"
                variant="primary"
                disabled={isPending || !isQuantityValid}
                className="w-full"
                onClick={handleSubmit}
              >
                {isPending ? t.consumer.orderNew.submitting : t.consumer.orderNew.summary.payButton}
              </Button>
            )}
          </>
        )}
      </div>

      <div className="sticky top-24 h-fit w-95 shrink-0 rounded-lg border border-border bg-muted p-6">
        <div className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {t.consumer.orderNew.summary.title}
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">
                {t.consumer.orderNew.summary.productLine
                  .replace('{productName}', product.name)
                  .replace('{pageCount}', String(pageCount))
                  .replace('{quantity}', isQuantityValid ? String(quantity) : '-')}
              </span>
              <span className="text-foreground">
                {isQuantityValid ? `₩${merchandiseAmount.toLocaleString()}` : '-'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{t.consumer.orderNew.summary.shipping}</span>
              <span className="text-foreground">{isQuantityValid ? shippingDisplay : '-'}</span>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-heading text-xl font-bold text-foreground">
                {t.consumer.orderNew.summary.finalEstimate}
              </span>
              <span className="font-heading text-2xl font-bold text-primary">
                {isQuantityValid
                  ? `₩${totalAmount.toLocaleString()}`
                  : t.consumer.orderNew.summary.amountPending}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SortablePhotoItemProps {
  photo: PhotoItem;
  index: number;
  placeholderLabel: string;
  removeLabel: string;
  statusLabel: string | null;
  onRemove: (id: string) => void;
}

function SortablePhotoItem({
  photo,
  index,
  placeholderLabel,
  removeLabel,
  statusLabel,
  onRemove,
}: SortablePhotoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={cn(
        'relative aspect-square touch-none overflow-hidden rounded-md border border-border bg-muted',
        isDragging ? 'opacity-50' : undefined,
      )}
    >
      <span className="absolute top-1.5 left-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-background/90 text-xs font-semibold text-foreground">
        {index + 1}
      </span>
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
          {placeholderLabel}
        </div>
      )}
      {statusLabel ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-background/80 p-3 text-center text-xs font-medium">
          {photo.status === 'error' ? (
            <TriangleAlert aria-hidden="true" className="size-5 text-destructive" />
          ) : null}
          <span
            className={
              photo.status === 'error' ? 'leading-snug text-destructive' : 'text-foreground'
            }
          >
            {statusLabel}
          </span>
        </div>
      ) : null}
      <button
        type="button"
        aria-label={removeLabel}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(photo.id);
        }}
        className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
}

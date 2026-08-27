'use client';

import type { ChangeEvent } from 'react';
import { useRef, useState, useTransition } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PRODUCT_IMAGE_UPLOAD_RULE, STORAGE_BUCKETS } from '@/constants/file-upload';
import { LOCALE_LABELS, LOCALE_OPTIONS } from '@/constants/locale';
import {
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_SIZE_MAX_LENGTH,
  PRODUCT_SLUG_MAX_LENGTH,
} from '@/constants/product';
import { PRODUCT_CATEGORY } from '@/constants/product-category';
import { fieldErrorMessage } from '@/lib/forms/field-error-message';
import { createBrowserSupabaseClient } from '@/lib/supabase/browser-client';
import { createProductImageSignedUploadUrl } from '@/lib/uploads/create-product-image-signed-upload-url';
import { type Locale, defaultLocale, locales } from '@/locales';

import type { ProductActionResult } from './actions';
import { type ProductFormInput, productFormSchema } from './product-schema';

function getFallbackLocale(locale: Locale): Locale | null {
  if (locale === defaultLocale) {
    return null;
  }
  if (locale === 'en') {
    return defaultLocale;
  }
  return 'en';
}

interface ProductFormProps {
  defaultValues?: ProductFormInput;
  action: (values: ProductFormInput) => Promise<ProductActionResult | undefined>;
  submitLabel: string;
  submittingLabel: string;
  onSuccess: () => void;
}

export function ProductForm({
  defaultValues,
  action,
  submitLabel,
  submittingLabel,
  onSuccess,
}: ProductFormProps) {
  const t = locales[defaultLocale];
  const [isPending, startTransition] = useTransition();
  const [activeLanguage, setActiveLanguage] = useState<Locale>(defaultLocale);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues ?? { category: PRODUCT_CATEGORY.CLASSIC, isActive: true },
  });
  const nameEnValue = useWatch({ control, name: 'nameEn' });
  const descriptionEnValue = useWatch({ control, name: 'descriptionEn' });
  const imageUrlValue = useWatch({ control, name: 'imageUrl' });
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  function handleImageFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    if (
      !PRODUCT_IMAGE_UPLOAD_RULE.allowedMimeTypes.includes(file.type) ||
      file.size > PRODUCT_IMAGE_UPLOAD_RULE.maxSizeBytes
    ) {
      toast.error(t.admin.products.errors.validation_failed);
      return;
    }

    setIsUploadingImage(true);
    startTransition(async () => {
      const signed = await createProductImageSignedUploadUrl({
        fileType: file.type,
        fileSize: file.size,
      });
      if (!signed.success) {
        toast.error(t.admin.products.errors[signed.errorCode]);
        setIsUploadingImage(false);
        return;
      }

      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
        .uploadToSignedUrl(signed.path, signed.token, file);
      setIsUploadingImage(false);
      if (error) {
        toast.error(t.admin.products.errors.unexpected_error);
        return;
      }

      setValue('imageUrl', signed.publicUrl, { shouldValidate: true, shouldDirty: true });
    });
  }

  const isKorean = activeLanguage === defaultLocale;
  const nameFieldName = isKorean ? 'name' : 'nameEn';
  const descriptionFieldName = isKorean ? 'description' : 'descriptionEn';
  const fallbackLocale = getFallbackLocale(activeLanguage);
  const fallbackNotice = fallbackLocale
    ? t.admin.products.form.fallbackNotice.replace(
        '{fallbackLanguage}',
        LOCALE_LABELS[fallbackLocale],
      )
    : null;
  const showNameFallbackNotice = fallbackNotice !== null && !nameEnValue;
  const showDescriptionFallbackNotice = fallbackNotice !== null && !descriptionEnValue;

  function onSubmit(values: ProductFormInput) {
    startTransition(async () => {
      const result = await action(values);
      if (result) {
        toast.error(t.admin.products.errors[result.errorCode]);
        return;
      }

      toast.success(t.admin.products.saveSuccess);
      onSuccess();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slug">{t.admin.products.form.slugLabel}</Label>
        <Input id="slug" type="text" maxLength={PRODUCT_SLUG_MAX_LENGTH} {...register('slug')} />
        {errors.slug ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(t.admin.products.errors.fields.slug, errors.slug.type)}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="size">{t.admin.products.form.sizeLabel}</Label>
        <Input id="size" type="text" maxLength={PRODUCT_SIZE_MAX_LENGTH} {...register('size')} />
        {errors.size ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(t.admin.products.errors.fields.size, errors.size.type)}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-primary/30 bg-primary-soft/40 p-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="productLanguage">{t.admin.products.form.languageLabel}</Label>
          <Select
            value={activeLanguage}
            onValueChange={(value) => setActiveLanguage(value as Locale)}
          >
            <SelectTrigger id="productLanguage" className="w-40">
              <SelectValue>{LOCALE_LABELS[activeLanguage]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {LOCALE_OPTIONS.map((locale) => (
                <SelectItem key={locale} value={locale}>
                  {LOCALE_LABELS[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={nameFieldName}>
              {`${t.admin.products.form.nameLabel}(${LOCALE_LABELS[activeLanguage]})`}
            </Label>
            <Input
              id={nameFieldName}
              type="text"
              maxLength={PRODUCT_NAME_MAX_LENGTH}
              {...register(nameFieldName)}
            />
            {isKorean && errors.name ? (
              <p className="text-sm text-destructive">
                {fieldErrorMessage(t.admin.products.errors.fields.name, errors.name.type)}
              </p>
            ) : null}
            {showNameFallbackNotice ? (
              <p className="text-xs text-muted-foreground">{fallbackNotice}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={descriptionFieldName}>
              {`${t.admin.products.form.descriptionLabel}(${LOCALE_LABELS[activeLanguage]})`}
            </Label>
            <textarea
              id={descriptionFieldName}
              rows={4}
              maxLength={PRODUCT_DESCRIPTION_MAX_LENGTH}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register(descriptionFieldName)}
            />
            {isKorean && errors.description ? (
              <p className="text-sm text-destructive">
                {fieldErrorMessage(
                  t.admin.products.errors.fields.description,
                  errors.description.type,
                )}
              </p>
            ) : null}
            {showDescriptionFallbackNotice ? (
              <p className="text-xs text-muted-foreground">{fallbackNotice}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price">{t.admin.products.form.priceLabel}</Label>
        <Input id="price" type="number" min={0} {...register('price')} />
        {errors.price ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(t.admin.products.errors.fields.price, errors.price.type)}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="imageUrl">{t.admin.products.form.imageUrlLabel}</Label>
        <input type="hidden" {...register('imageUrl')} />
        <div className="flex items-center gap-3">
          {imageUrlValue ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrlValue}
              alt=""
              className="h-16 w-16 rounded-md border border-border object-cover"
            />
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploadingImage}
            onClick={() => imageInputRef.current?.click()}
          >
            {isUploadingImage
              ? t.admin.products.form.imageUploading
              : t.admin.products.form.imageUploadButton}
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImageFileChange}
          />
        </div>
        {errors.imageUrl ? (
          <p className="text-sm text-destructive">{t.admin.products.errors.validation_failed}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">{t.admin.products.form.categoryLabel}</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="category" className="w-40">
                <SelectValue>
                  {(value: string) =>
                    value === PRODUCT_CATEGORY.PREMIUM
                      ? t.admin.products.categoryOptions.premium
                      : t.admin.products.categoryOptions.classic
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PRODUCT_CATEGORY.CLASSIC}>
                  {t.admin.products.categoryOptions.classic}
                </SelectItem>
                <SelectItem value={PRODUCT_CATEGORY.PREMIUM}>
                  {t.admin.products.categoryOptions.premium}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="isActive"
          render={({ field }) => (
            <Checkbox
              id="isActive"
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="isActive" className="font-normal">
          {t.admin.products.form.isActiveLabel}
        </Label>
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}

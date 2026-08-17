'use client';

import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
import { PRODUCT_CATEGORY } from '@/constants/product-category';
import { defaultLocale, locales } from '@/locales';

import type { ProductActionResult } from './actions';
import { type ProductFormInput, productFormSchema } from './product-schema';

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
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues ?? { category: PRODUCT_CATEGORY.CLASSIC, isActive: true },
  });

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
        <Input id="slug" type="text" {...register('slug')} />
        {errors.slug ? (
          <p className="text-sm text-destructive">{t.admin.products.errors.validation_failed}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{t.admin.products.form.nameLabel}</Label>
        <Input id="name" type="text" {...register('name')} />
        {errors.name ? (
          <p className="text-sm text-destructive">{t.admin.products.errors.validation_failed}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nameEn">{t.admin.products.form.nameEnLabel}</Label>
        <Input id="nameEn" type="text" {...register('nameEn')} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="size">{t.admin.products.form.sizeLabel}</Label>
        <Input id="size" type="text" {...register('size')} />
        {errors.size ? (
          <p className="text-sm text-destructive">{t.admin.products.errors.validation_failed}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">{t.admin.products.form.descriptionLabel}</Label>
        <textarea
          id="description"
          rows={4}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          {...register('description')}
        />
        {errors.description ? (
          <p className="text-sm text-destructive">{t.admin.products.errors.validation_failed}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price">{t.admin.products.form.priceLabel}</Label>
        <Input id="price" type="number" min={0} {...register('price')} />
        {errors.price ? (
          <p className="text-sm text-destructive">{t.admin.products.errors.validation_failed}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="imageUrl">{t.admin.products.form.imageUrlLabel}</Label>
        <Input id="imageUrl" type="text" {...register('imageUrl')} />
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
            <Checkbox id="isActive" checked={field.value} onCheckedChange={field.onChange} />
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

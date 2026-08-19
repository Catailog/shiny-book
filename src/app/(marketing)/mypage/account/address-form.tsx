'use client';

import { useTransition } from 'react';
import type { Address } from 'react-daum-postcode';
import { useKakaoPostcodePopup } from 'react-daum-postcode';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useT } from '@/hooks/use-t';

import { createAddress, updateAddress } from './address-actions';
import { type AddressFormInput, addressFormSchema } from './address-schema';

interface AddressFormProps {
  addressId?: string;
  defaultValues?: AddressFormInput;
  onSuccess: () => void;
}

export function AddressForm({ addressId, defaultValues, onSuccess }: AddressFormProps) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const openPostcodePopup = useKakaoPostcodePopup();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormInput>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: defaultValues ?? { isDefault: false },
  });

  function handleSearchAddress() {
    void openPostcodePopup({
      onComplete: (data: Address) => {
        setValue('postalCode', data.zonecode);
        setValue('addressLine1', data.roadAddress || data.jibunAddress);
      },
    });
  }

  function onSubmit(values: AddressFormInput) {
    startTransition(async () => {
      const result = addressId
        ? await updateAddress(addressId, values)
        : await createAddress(values);

      if (result) {
        toast.error(t.consumer.account.shippingAddress.errors[result.errorCode]);
        return;
      }

      onSuccess();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-label">{t.consumer.account.shippingAddress.form.labelLabel}</Label>
        <Input id="address-label" {...register('label')} />
        {errors.label ? (
          <p className="text-sm text-destructive">
            {t.consumer.account.shippingAddress.errors.validation_failed}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-recipient">
          {t.consumer.account.shippingAddress.form.recipientNameLabel}
        </Label>
        <Input id="address-recipient" {...register('recipientName')} />
        {errors.recipientName ? (
          <p className="text-sm text-destructive">
            {t.consumer.account.shippingAddress.errors.validation_failed}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-phone">{t.consumer.account.shippingAddress.form.phoneLabel}</Label>
        <Input id="address-phone" type="tel" {...register('phone')} />
        {errors.phone ? (
          <p className="text-sm text-destructive">
            {t.consumer.account.shippingAddress.errors.validation_failed}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-postal-code">
          {t.consumer.account.shippingAddress.form.postalCodeLabel}
        </Label>
        <div className="flex items-center gap-2">
          <Input id="address-postal-code" readOnly {...register('postalCode')} />
          <Button
            type="button"
            variant="outline"
            className="shrink-0"
            onClick={handleSearchAddress}
          >
            {t.consumer.account.shippingAddress.form.searchAddressButton}
          </Button>
        </div>
        {errors.postalCode ? (
          <p className="text-sm text-destructive">
            {t.consumer.account.shippingAddress.errors.validation_failed}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-line1">
          {t.consumer.account.shippingAddress.form.addressLine1Label}
        </Label>
        <Input id="address-line1" readOnly {...register('addressLine1')} />
        {errors.addressLine1 ? (
          <p className="text-sm text-destructive">
            {t.consumer.account.shippingAddress.errors.validation_failed}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-line2">
          {t.consumer.account.shippingAddress.form.addressLine2Label}
        </Label>
        <Input id="address-line2" {...register('addressLine2')} />
      </div>
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="isDefault"
          render={({ field }) => (
            <Checkbox
              id="address-is-default"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="address-is-default" className="font-normal">
          {t.consumer.account.shippingAddress.form.isDefaultLabel}
        </Label>
      </div>
      <Button type="submit" variant="primary" disabled={isPending} className="w-fit">
        {isPending
          ? t.consumer.account.shippingAddress.form.submitting
          : t.consumer.account.shippingAddress.form.submitButton}
      </Button>
    </form>
  );
}

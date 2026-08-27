'use client';

import { useTransition } from 'react';
import type { Address } from 'react-daum-postcode';
import { useKakaoPostcodePopup } from 'react-daum-postcode';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { CharCounterField } from '@/components/char-counter-field';
import { PhoneInput } from '@/components/phone-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ADDRESS_LABEL_MAX_LENGTH, ADDRESS_LINE_MAX_LENGTH } from '@/constants/address';
import { PERSON_NAME_MAX_LENGTH } from '@/constants/person-name';
import { useT } from '@/hooks/use-t';
import { fieldErrorMessage } from '@/lib/forms/field-error-message';

import { createAddress, updateAddress } from './address-actions';
import { type AddressFormInput, addressFormSchema } from './address-schema';

interface AddressFormProps {
  addressId?: string;
  defaultValues?: AddressFormInput;
  defaultPhone?: string;
  onSuccess: () => void;
}

export function AddressForm({
  addressId,
  defaultValues,
  defaultPhone,
  onSuccess,
}: AddressFormProps) {
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
    defaultValues: defaultValues ?? { isDefault: false, phone: defaultPhone ?? '' },
  });

  function handleSearchAddress() {
    void openPostcodePopup({
      onComplete: (data: Address) => {
        setValue('postalCode', data.zonecode, { shouldValidate: true });
        setValue('addressLine1', data.roadAddress || data.jibunAddress, { shouldValidate: true });
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
        <Input id="address-label" maxLength={ADDRESS_LABEL_MAX_LENGTH} {...register('label')} />
        <CharCounterField control={control} name="label" max={ADDRESS_LABEL_MAX_LENGTH} />
        {errors.label ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(
              t.consumer.account.shippingAddress.errors.fields.label,
              errors.label.type,
            )}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-recipient">
          {t.consumer.account.shippingAddress.form.recipientNameLabel}
        </Label>
        <Input
          id="address-recipient"
          maxLength={PERSON_NAME_MAX_LENGTH}
          {...register('recipientName')}
        />
        <CharCounterField control={control} name="recipientName" max={PERSON_NAME_MAX_LENGTH} />
        {errors.recipientName ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(
              t.consumer.account.shippingAddress.errors.fields.recipientName,
              errors.recipientName.type,
            )}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-phone">{t.consumer.account.shippingAddress.form.phoneLabel}</Label>
        <PhoneInput id="address-phone" {...register('phone')} />
        {errors.phone ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(
              t.consumer.account.shippingAddress.errors.fields.phone,
              errors.phone.type,
            )}
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
            {fieldErrorMessage(
              t.consumer.account.shippingAddress.errors.fields.postalCode,
              errors.postalCode.type,
            )}
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
            {fieldErrorMessage(
              t.consumer.account.shippingAddress.errors.fields.addressLine1,
              errors.addressLine1.type,
            )}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address-line2">
          {t.consumer.account.shippingAddress.form.addressLine2Label}
        </Label>
        <Input
          id="address-line2"
          maxLength={ADDRESS_LINE_MAX_LENGTH}
          {...register('addressLine2')}
        />
        <CharCounterField control={control} name="addressLine2" max={ADDRESS_LINE_MAX_LENGTH} />
      </div>
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="isDefault"
          render={({ field }) => (
            <Checkbox
              id="address-is-default"
              name={field.name}
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

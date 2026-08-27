'use client';

import { useEffect, useState, useTransition } from 'react';
import type { DateRange } from 'react-day-picker';
import { Controller, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUPON_CODE_MAX_LENGTH, DISCOUNT_TYPE } from '@/constants/coupon';
import { fieldErrorMessage } from '@/lib/forms/field-error-message';
import { cn } from '@/lib/utils';
import { defaultLocale, locales } from '@/locales';

import { createCoupon } from './actions';
import { type CouponFormInput, couponFormSchema } from './coupon-schema';

const DATE_ONLY_FORMAT = 'yyyy-MM-dd';
const DATE_DISPLAY_FORMAT = 'yyyy.MM.dd';

interface CouponFormProps {
  onSuccess?: () => void;
}

export function CouponForm({ onSuccess }: CouponFormProps) {
  const t = locales[defaultLocale];
  const [isPending, startTransition] = useTransition();
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CouponFormInput>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: { discountType: DISCOUNT_TYPE.PERCENTAGE },
  });

  useEffect(() => {
    setValue('startsAt', range?.from ? format(range.from, DATE_ONLY_FORMAT) : undefined);
    setValue('expiresAt', range?.to ? format(range.to, DATE_ONLY_FORMAT) : undefined);
  }, [range, setValue]);

  function onSubmit(values: CouponFormInput) {
    startTransition(async () => {
      const result = await createCoupon({
        code: values.code,
        discountType: values.discountType,
        discountValue: values.discountValue,
        maxUses: values.maxUses ? Number(values.maxUses) : undefined,
        startsAt: values.startsAt || undefined,
        expiresAt: values.expiresAt || undefined,
      });

      if (result) {
        toast.error(t.admin.coupons.errors[result.errorCode]);
        return;
      }

      toast.success(t.admin.coupons.createSuccess);
      if (onSuccess) {
        onSuccess();
      } else {
        reset();
        setRange(undefined);
      }
    });
  }

  const periodLabel =
    range?.from && range.to
      ? `${format(range.from, DATE_DISPLAY_FORMAT)} - ${format(range.to, DATE_DISPLAY_FORMAT)}`
      : range?.from
        ? format(range.from, DATE_DISPLAY_FORMAT)
        : t.admin.coupons.form.periodPlaceholder;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-3" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="code">{t.admin.coupons.form.codeLabel}</Label>
        <Input
          id="code"
          type="text"
          maxLength={COUPON_CODE_MAX_LENGTH}
          className="w-40"
          {...register('code')}
        />
        {errors.code ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(t.admin.coupons.errors.fields.code, errors.code.type)}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="discountType">{t.admin.coupons.form.discountTypeLabel}</Label>
        <Controller
          control={control}
          name="discountType"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="discountType" className="w-32">
                <SelectValue>
                  {(value: string) =>
                    value === DISCOUNT_TYPE.PERCENTAGE
                      ? t.admin.coupons.discountTypeOptions.percentage
                      : t.admin.coupons.discountTypeOptions.fixed
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DISCOUNT_TYPE.PERCENTAGE}>
                  {t.admin.coupons.discountTypeOptions.percentage}
                </SelectItem>
                <SelectItem value={DISCOUNT_TYPE.FIXED}>
                  {t.admin.coupons.discountTypeOptions.fixed}
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="discountValue">{t.admin.coupons.form.discountValueLabel}</Label>
        <Input
          id="discountValue"
          type="number"
          min={1}
          className="w-28"
          {...register('discountValue')}
        />
        {errors.discountValue ? (
          <p className="text-sm text-destructive">
            {fieldErrorMessage(
              t.admin.coupons.errors.fields.discountValue,
              errors.discountValue.type,
            )}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="maxUses">{t.admin.coupons.form.maxUsesLabel}</Label>
        <Input id="maxUses" type="number" min={1} className="w-28" {...register('maxUses')} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="period">{t.admin.coupons.form.periodLabel}</Label>
        <Popover open={isRangeOpen} onOpenChange={setIsRangeOpen}>
          <PopoverTrigger
            render={
              <Button
                id="period"
                type="button"
                variant="outline"
                className={cn(
                  'w-56 justify-start font-normal',
                  !range?.from && 'text-muted-foreground',
                )}
              />
            }
          >
            <CalendarIcon aria-hidden="true" className="size-4" />
            {periodLabel}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              defaultMonth={range?.from}
            />
          </PopoverContent>
        </Popover>
        {errors.startsAt ? (
          <p className="text-sm text-destructive">{t.admin.coupons.errors.fields.period}</p>
        ) : null}
      </div>
      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? t.admin.coupons.form.submitting : t.admin.coupons.form.submitButton}
      </Button>
    </form>
  );
}

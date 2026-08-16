'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { DISCOUNT_TYPE, type DiscountType } from '@/constants/coupon';
import { useT } from '@/hooks/use-t';

interface CreateCouponFormProps {
  cancelHref: string;
}

export function CreateCouponForm({ cancelHref }: CreateCouponFormProps) {
  const t = useT();
  const [code, setCode] = useState('AUTUMN30K');
  const [type, setType] = useState<DiscountType>(DISCOUNT_TYPE.PERCENTAGE);
  const [value, setValue] = useState('10');
  const [minOrder, setMinOrder] = useState('50,000');
  const [endDate, setEndDate] = useState('2025.11.15');

  function generateCode() {
    setCode(`SAVE${Math.floor(1000 + Math.random() * 9000)}`);
  }

  const discountLabel = type === DISCOUNT_TYPE.PERCENTAGE ? `${value || 0}%` : `₩${value || 0}`;

  return (
    <>
      <div className="flex-1 rounded-lg border border-border bg-card p-8">
        <h2 className="mb-6 font-heading text-xl font-bold text-foreground">
          {t.admin.coupons.create.specificationsTitle}
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="coupon-code">{t.admin.coupons.create.codeLabel}</Label>
            <div className="flex gap-3">
              <Input
                id="coupon-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={generateCode}>
                {t.admin.coupons.create.autoGenerateButton}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t.admin.coupons.create.typeLabel}</Label>
            <RadioGroup
              value={type}
              onValueChange={(next) => setType(next as DiscountType)}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value={DISCOUNT_TYPE.PERCENTAGE} id="type-percentage" />
                <Label htmlFor="type-percentage" className="font-normal">
                  {t.admin.coupons.create.typeOptions.percentage}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value={DISCOUNT_TYPE.FIXED} id="type-fixed" />
                <Label htmlFor="type-fixed" className="font-normal">
                  {t.admin.coupons.create.typeOptions.fixed}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="coupon-value">{t.admin.coupons.create.valueLabel}</Label>
              <Input
                id="coupon-value"
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="coupon-min-order">{t.admin.coupons.create.minOrderLabel}</Label>
              <Input
                id="coupon-min-order"
                value={minOrder}
                onChange={(event) => setMinOrder(event.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="coupon-start-date">{t.admin.coupons.create.startDateLabel}</Label>
              <Input id="coupon-start-date" type="date" defaultValue="2025-10-15" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="coupon-end-date">{t.admin.coupons.create.endDateLabel}</Label>
              <Input
                id="coupon-end-date"
                type="date"
                defaultValue="2025-11-15"
                onChange={(event) => setEndDate(event.target.value.replaceAll('-', '.') || endDate)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="coupon-description">{t.admin.coupons.create.descriptionLabel}</Label>
            <Textarea id="coupon-description" rows={4} />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" render={<Link href={cancelHref} />} nativeButton={false}>
              {t.admin.coupons.create.cancelButton}
            </Button>
            <Button render={<Link href={cancelHref} />} nativeButton={false}>
              {t.admin.coupons.create.submitButton}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex w-100 shrink-0 flex-col gap-3">
        <span className="text-xs font-bold text-muted-foreground">
          {t.admin.coupons.create.previewLabel}
        </span>
        <div className="flex flex-col justify-between gap-6 rounded-xl border border-ink bg-primary p-8 text-primary-foreground">
          <span className="font-heading text-sm font-semibold">Shiny Book</span>
          <div className="flex flex-col gap-1">
            <span className="font-heading text-5xl font-bold">{discountLabel} OFF</span>
            <span className="text-xs">
              {t.admin.coupons.create.previewMinPurchase} ₩{minOrder || 0}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-primary-foreground/50 pt-4">
            <span className="rounded border border-dashed border-primary-foreground px-4 py-2 text-base font-bold">
              {code || '-'}
            </span>
            <span className="text-xs">
              {t.admin.coupons.create.previewExpires} {endDate}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

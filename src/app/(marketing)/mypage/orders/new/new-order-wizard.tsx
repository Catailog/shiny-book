'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useT } from '@/hooks/use-t';
import { cn } from '@/lib/utils';

const PRODUCT_TYPES = [
  {
    key: 'premiumAlbum',
    descriptionKey: 'premiumAlbumDescription',
    image: '/images/products/premium-photo-album.png',
  },
  {
    key: 'classicHardcover',
    descriptionKey: 'classicHardcoverDescription',
    image: '/images/products/hardcover-photobook.png',
  },
  {
    key: 'modernSoftcover',
    descriptionKey: 'modernSoftcoverDescription',
    image: '/images/products/softcover-photobook.png',
  },
] as const;

export function NewOrderWizard() {
  const t = useT();
  const [selected, setSelected] = useState<(typeof PRODUCT_TYPES)[number]['key']>('premiumAlbum');

  return (
    <div className="flex gap-6">
      <div className="flex flex-1 flex-col gap-10">
        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {t.consumer.orderNew.productStep.heading}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {PRODUCT_TYPES.map((product) => (
              <button
                key={product.key}
                type="button"
                onClick={() => setSelected(product.key)}
                className={cn(
                  'flex flex-col gap-3 rounded-md border p-4 text-left transition-colors',
                  selected === product.key
                    ? 'border-primary bg-primary-soft'
                    : 'border-border bg-card hover:border-primary/50',
                )}
              >
                <div className="relative h-25 w-full overflow-hidden rounded bg-muted">
                  <Image src={product.image} alt="" fill sizes="240px" className="object-cover" />
                </div>
                <div>
                  <p className="font-heading text-lg font-bold text-foreground">
                    {t.consumer.orderNew.productStep[product.key]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.consumer.orderNew.productStep[product.descriptionKey]}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {t.consumer.orderNew.uploadStep.heading}
          </h2>
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-primary bg-muted px-4 py-10">
            <Upload aria-hidden="true" className="size-9 text-primary" />
            <p className="text-sm font-semibold text-foreground">
              {t.consumer.orderNew.uploadStep.dropzoneTitle}
            </p>
            <p className="text-xs text-muted-foreground">
              {t.consumer.orderNew.uploadStep.dropzoneHint}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {t.consumer.orderNew.detailsStep.heading}
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label>{t.consumer.orderNew.detailsStep.sizeLabel}</Label>
              <div className="rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                {t.consumer.orderNew.detailsStep.sizeValue}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t.consumer.orderNew.detailsStep.paperLabel}</Label>
              <div className="rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                {t.consumer.orderNew.detailsStep.paperValue}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>{t.consumer.orderNew.detailsStep.coverLabel}</Label>
            <div className="rounded-md border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              {t.consumer.orderNew.detailsStep.coverValue}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="order-notes">{t.consumer.orderNew.detailsStep.notesLabel}</Label>
            <Textarea
              id="order-notes"
              rows={4}
              placeholder={t.consumer.orderNew.detailsStep.notesPlaceholder}
            />
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
              <span className="text-muted-foreground">
                {t.consumer.orderNew.summary.basicProduct}
              </span>
              <span className="text-foreground">₩160,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t.consumer.orderNew.summary.pageAddon}</span>
              <span className="text-foreground">₩24,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {t.consumer.orderNew.summary.coverEmbossing}
              </span>
              <span className="text-foreground">₩15,000</span>
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
              <span className="font-heading text-2xl font-bold text-primary">₩199,000</span>
            </div>
          </div>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {t.consumer.orderNew.summary.payButton}
          </Button>
        </div>
      </div>
    </div>
  );
}

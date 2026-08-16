import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { CONSUMER_ROUTES } from '@/constants/routes';
import type { CatalogProduct } from '@/lib/products/get-product-catalog';

interface ProductCardProps {
  item: CatalogProduct;
  startingFromLabel: string;
  ctaLabel: string;
}

export function ProductCard({ item, startingFromLabel, ctaLabel }: ProductCardProps) {
  return (
    <Link href={CONSUMER_ROUTES.NEW_ORDER} className="group block">
      <Card className="overflow-hidden py-0 shadow-none ring-border transition-shadow group-hover:shadow-lg group-hover:ring-primary">
        <div className="relative h-76 w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <CardContent className="flex flex-col gap-5 px-7 py-7">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="font-heading text-2xl font-semibold text-foreground">{item.name}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase">{item.size}</p>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] text-muted-foreground uppercase">{startingFromLabel}</p>
              <p className="font-heading text-lg font-bold text-primary">{item.price}</p>
            </div>
            <span className="flex items-center gap-1 text-[13px] font-semibold text-foreground">
              {ctaLabel}
              <ArrowRight aria-hidden="true" className="size-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

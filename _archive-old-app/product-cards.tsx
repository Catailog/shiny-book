'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { SiteContainer } from '@/components/site-container';
import { Card, CardContent } from '@/components/ui/card';
import { HOME_SECTION_ANCHORS } from '@/constants/home-sections';
import { PRODUCT_CATALOG, type ProductCategory } from '@/constants/product-catalog';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';
import { cn } from '@/lib/utils';

type ProductFilter = 'all' | ProductCategory;

export function ProductCards() {
  const t = useT();
  const copy = t.site.home.products;
  const [activeFilter, setActiveFilter] = useState<ProductFilter>('all');

  const products = copy.items
    .flatMap((item, index) => {
      const meta = PRODUCT_CATALOG[index];
      return meta ? [{ ...item, ...meta }] : [];
    })
    .filter((product) => activeFilter === 'all' || product.category === activeFilter);

  const filters: Array<{ value: ProductFilter; label: string }> = [
    { value: 'all', label: copy.filters.all },
    { value: 'classic', label: copy.filters.classic },
    { value: 'premium', label: copy.filters.premium },
  ];

  return (
    <SiteContainer
      id={HOME_SECTION_ANCHORS.PRODUCT_COLLECTION}
      className="flex scroll-mt-20 flex-col gap-10 py-16 lg:gap-16 lg:py-24"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-xl flex-col items-start gap-3">
          <span className="text-accent text-xs font-semibold tracking-wide uppercase">
            {copy.eyebrow}
          </span>
          <h2 className="font-heading text-3xl font-medium text-foreground sm:text-4xl">
            {copy.title}
          </h2>
        </div>
        <div
          role="group"
          aria-label={copy.filterLabel}
          className="flex flex-wrap justify-start gap-2.5 lg:justify-end"
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={cn(
                'cursor-pointer rounded border border-foreground px-4 py-2 text-xs font-semibold tracking-wide transition-colors',
                activeFilter === filter.value
                  ? 'bg-foreground text-background'
                  : 'bg-transparent text-foreground hover:bg-foreground hover:text-background',
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {products.map((product) => (
          <Link key={product.name} href={CONSUMER_ROUTES.NEW_ORDER} className="group">
            <Card className="overflow-hidden rounded-lg border border-border p-0 shadow-lg ring-0 transition-shadow group-hover:shadow-xl">
              <CardContent className="flex h-full flex-col p-0">
                <div className="relative aspect-4/3 w-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-2xl font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <div className="mt-auto flex flex-col items-start gap-0.5 border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground uppercase">
                      {copy.startingFromLabel}
                    </span>
                    <span className="text-accent font-heading text-lg font-bold">
                      {product.price}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </SiteContainer>
  );
}

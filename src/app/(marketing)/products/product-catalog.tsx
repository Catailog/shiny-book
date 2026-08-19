'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { FilterButton } from '@/components/filter-button';
import { Card, CardContent } from '@/components/ui/card';
import type { ProductCategory } from '@/constants/product-category';
import { PRODUCT_ROUTES } from '@/constants/routes';
import type { CatalogProduct } from '@/lib/products/get-product-catalog';

interface ProductCatalogProps {
  items: CatalogProduct[];
  filters: { all: string; classic: string; premium: string };
  resultsLabel: string;
  viewDetailsLabel: string;
  startingFromLabel: string;
}

type FilterValue = ProductCategory | 'all';

export function ProductCatalog({
  items,
  filters,
  resultsLabel,
  viewDetailsLabel,
  startingFromLabel,
}: ProductCatalogProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  const filterOptions: Array<{ value: FilterValue; label: string }> = [
    { value: 'all', label: filters.all },
    { value: 'classic', label: filters.classic },
    { value: 'premium', label: filters.premium },
  ];

  const visibleItems =
    activeFilter === 'all' ? items : items.filter((item) => item.category === activeFilter);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div className="flex flex-wrap gap-3">
          {filterOptions.map((option) => (
            <FilterButton
              key={option.value}
              label={option.label}
              isActive={activeFilter === option.value}
              onClick={() => setActiveFilter(option.value)}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          {resultsLabel.replace('{count}', String(visibleItems.length))}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <Link
            key={item.slug}
            href={`${PRODUCT_ROUTES.LIST}/${item.slug}`}
            className="group block"
          >
            <Card className="overflow-hidden py-0 shadow-none ring-border transition-shadow group-hover:shadow-lg group-hover:ring-primary">
              <div className="relative h-80 w-full">
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
                    <p className="font-heading text-xl font-semibold text-foreground">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.size}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[11px] text-muted-foreground uppercase">
                      {startingFromLabel}
                    </p>
                    <p className="font-heading text-lg font-bold text-primary">{item.price}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[13px] font-semibold text-foreground">
                    {viewDetailsLabel}
                    <ArrowRight aria-hidden="true" className="size-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

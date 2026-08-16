'use client';

import { useState } from 'react';

import { FilterButton } from '@/components/filter-button';
import { ProductCard } from '@/components/product-card';
import type { ProductCategory } from '@/constants/product-catalog';
import type { CatalogProduct } from '@/lib/products/get-product-catalog';

interface ProductFilters {
  all: string;
  classic: string;
  premium: string;
}

interface ProductFilterGridProps {
  items: CatalogProduct[];
  filters: ProductFilters;
  filterLabel: string;
  startingFromLabel: string;
  ctaLabel: string;
}

type FilterValue = ProductCategory | 'all';

export function ProductFilterGrid({
  items,
  filters,
  filterLabel,
  startingFromLabel,
  ctaLabel,
}: ProductFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  const filterOptions: Array<{ value: FilterValue; label: string }> = [
    { value: 'all', label: filters.all },
    { value: 'classic', label: filters.classic },
    { value: 'premium', label: filters.premium },
  ];

  const visibleItems =
    activeFilter === 'all' ? items : items.filter((item) => item.category === activeFilter);

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label={filterLabel} className="flex flex-wrap gap-3">
        {filterOptions.map((option) => (
          <FilterButton
            key={option.value}
            label={option.label}
            isActive={activeFilter === option.value}
            onClick={() => setActiveFilter(option.value)}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <ProductCard
            key={item.slug}
            item={item}
            startingFromLabel={startingFromLabel}
            ctaLabel={ctaLabel}
          />
        ))}
      </div>
    </div>
  );
}

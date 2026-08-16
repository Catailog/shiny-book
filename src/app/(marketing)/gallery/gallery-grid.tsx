'use client';

import { useState } from 'react';

import Image from 'next/image';

import { FilterButton } from '@/components/filter-button';

type GalleryCategory = 'wedding' | 'travel' | 'family' | 'baby' | 'lifestyle';

interface GalleryItem {
  image: string;
  category: GalleryCategory;
  title: string;
  description: string;
}

interface GalleryFilters {
  all: string;
  wedding: string;
  travel: string;
  family: string;
  baby: string;
  lifestyle: string;
}

interface GalleryGridProps {
  items: readonly GalleryItem[];
  filters: GalleryFilters;
}

type FilterValue = GalleryCategory | 'all';

export function GalleryGrid({ items, filters }: GalleryGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all');

  const filterOptions: Array<{ value: FilterValue; label: string }> = [
    { value: 'all', label: filters.all },
    { value: 'wedding', label: filters.wedding },
    { value: 'travel', label: filters.travel },
    { value: 'family', label: filters.family },
    { value: 'baby', label: filters.baby },
    { value: 'lifestyle', label: filters.lifestyle },
  ];

  const visibleItems =
    activeFilter === 'all' ? items : items.filter((item) => item.category === activeFilter);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap gap-3 border-b border-border pb-8">
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
          <div key={item.title} className="flex flex-col gap-5">
            <div className="relative h-105 w-full overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="w-fit rounded bg-primary-soft px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary uppercase">
                {filters[item.category]}
              </span>
              <p className="font-heading text-xl font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

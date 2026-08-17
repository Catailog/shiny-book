'use client';

import { filterButtonClassName } from '@/lib/filter-button-style';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function FilterButton({ label, isActive, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={filterButtonClassName(isActive)}
    >
      {label}
    </button>
  );
}

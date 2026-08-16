'use client';

import { cn } from '@/lib/utils';

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
      className={cn(
        'rounded border px-5 py-2.5 text-[13px] font-semibold transition-colors',
        isActive
          ? 'border-primary bg-primary-soft text-primary'
          : 'border-border text-foreground hover:bg-muted',
      )}
    >
      {label}
    </button>
  );
}

import { cn } from '@/lib/utils';

export function filterButtonClassName(isActive: boolean, className?: string): string {
  return cn(
    'rounded border px-5 py-2.5 text-[13px] font-semibold transition-colors',
    isActive
      ? 'border-primary bg-primary-soft text-primary'
      : 'border-border text-foreground hover:bg-muted',
    className,
  );
}

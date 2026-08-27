'use client';

import { type Control, type FieldPath, type FieldValues, useWatch } from 'react-hook-form';

import { cn } from '@/lib/utils';

interface CharCounterFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  max: number;
}

// Live `current / max` counter for a React Hook Form text field, meant to sit directly
// under the input. Pinned to the right (via ml-auto in the field's flex column) with
// tabular figures so it never shifts as the digit count changes; turns destructive once
// the value goes over `max`. The "N characters or fewer" wording is left to the field's
// own submit-time validation error, not shown here.
export function CharCounterField<TFieldValues extends FieldValues>({
  control,
  name,
  max,
}: CharCounterFieldProps<TFieldValues>) {
  const value = useWatch({ control, name });
  const count = typeof value === 'string' ? value.length : 0;
  const isOver = count > max;

  return (
    <span
      className={cn(
        'ml-auto text-xs text-muted-foreground tabular-nums',
        isOver && 'font-medium text-destructive',
      )}
    >
      {count} / {max}
    </span>
  );
}

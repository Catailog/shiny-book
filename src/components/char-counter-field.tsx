'use client';

import { type Control, type FieldPath, type FieldValues, useWatch } from 'react-hook-form';

import { cn } from '@/lib/utils';

interface CharCounterFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  max: number;
  message?: string;
}

// Live `current / max` counter for a React Hook Form text field, meant to sit directly
// under the input. The counter is pinned to the right and uses tabular figures so it
// never shifts as the number of digits changes; an optional guidance message sits on
// the left and may grow/wrap without moving the counter. Both turn destructive once the
// value goes over `max`.
export function CharCounterField<TFieldValues extends FieldValues>({
  control,
  name,
  max,
  message,
}: CharCounterFieldProps<TFieldValues>) {
  const value = useWatch({ control, name });
  const count = typeof value === 'string' ? value.length : 0;
  const isOver = count > max;

  return (
    <div className="flex items-start gap-3 text-xs">
      {message ? (
        <span className={cn('text-muted-foreground', isOver && 'text-destructive')}>{message}</span>
      ) : null}
      <span
        className={cn(
          'ml-auto shrink-0 text-muted-foreground tabular-nums',
          isOver && 'font-medium text-destructive',
        )}
      >
        {count} / {max}
      </span>
    </div>
  );
}

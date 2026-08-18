'use client';

import type { ComponentProps, KeyboardEvent } from 'react';

import { useRouter } from 'next/navigation';

import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ClickableTableRowProps extends ComponentProps<typeof TableRow> {
  href: string;
}

export function ClickableTableRow({
  href,
  className,
  onKeyDown,
  ...props
}: ClickableTableRowProps) {
  const router = useRouter();

  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>) {
    onKeyDown?.(event);
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      router.push(href);
    }
  }

  return (
    <TableRow
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={handleKeyDown}
      className={cn('cursor-pointer hover:bg-muted/50', className)}
      {...props}
    />
  );
}

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SiteContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SiteContainer({ children, className, id }: SiteContainerProps) {
  return (
    <div id={id} className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-20', className)}>
      {children}
    </div>
  );
}

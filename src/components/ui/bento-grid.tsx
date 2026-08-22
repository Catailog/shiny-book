import { type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BentoGridProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
  className?: string;
}

function BentoGrid({ children, className, ...props }: BentoGridProps) {
  return (
    <div className={cn('grid w-full auto-rows-88 grid-cols-3 gap-4', className)} {...props}>
      {children}
    </div>
  );
}

export { BentoGrid };

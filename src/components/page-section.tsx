import type { ReactNode } from 'react';

import { SiteContainer } from '@/components/site-container';
import { cn } from '@/lib/utils';

interface PageSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  sectionClassName?: string;
}

export function PageSection({ children, id, className, sectionClassName }: PageSectionProps) {
  return (
    <section id={id} className={cn('w-full', sectionClassName)}>
      <SiteContainer className={className}>{children}</SiteContainer>
    </section>
  );
}

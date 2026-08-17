import Link from 'next/link';

import { filterButtonClassName } from '@/lib/filter-button-style';

interface FilterLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

export function FilterLink({ href, isActive, children }: FilterLinkProps) {
  return (
    <Link href={href} aria-pressed={isActive} className={filterButtonClassName(isActive)}>
      {children}
    </Link>
  );
}

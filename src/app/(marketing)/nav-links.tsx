'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BookOpen } from 'lucide-react';

import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  href: string;
}

interface NavLinksProps {
  brandName: string;
  links: NavLink[];
}

export function NavLinks({ brandName, links }: NavLinksProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <>
      <Link href="/" className="flex items-center gap-2">
        <BookOpen
          aria-hidden="true"
          strokeWidth={1.8}
          className={cn('size-5', isHome ? 'text-primary' : 'text-foreground')}
        />
        <span
          className={cn(
            'font-heading text-lg font-semibold',
            isHome ? 'text-primary' : 'text-foreground',
          )}
        >
          {brandName}
        </span>
      </Link>
      <nav className="hidden items-center gap-2 text-sm font-medium text-muted-foreground md:flex">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'px-3 py-1.5 transition-colors',
                isActive ? 'text-primary' : 'hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

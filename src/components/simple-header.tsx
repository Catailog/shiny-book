import Link from 'next/link';

import { BookOpen } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';

export function SimpleHeader() {
  return (
    <header className="h-20 w-full border-b border-border bg-background">
      <SiteContainer className="flex h-full items-center">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen aria-hidden="true" strokeWidth={1.8} className="size-5 text-foreground" />
          <span className="font-heading text-lg font-semibold text-foreground">Shiny Book</span>
        </Link>
      </SiteContainer>
    </header>
  );
}

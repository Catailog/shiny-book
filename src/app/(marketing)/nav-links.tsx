'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BookOpen, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface NavLinkEntry {
  type: 'link';
  label: string;
  href: string;
}

export interface NavGroupEntry {
  type: 'group';
  label: string;
  items: { label: string; href: string }[];
}

export type NavEntry = NavLinkEntry | NavGroupEntry;

interface NavLinksProps {
  brandName: string;
  entries: NavEntry[];
  openMenuLabel: string;
  menuTitle: string;
  mobileActions?: ReactNode;
}

const NAV_ITEM_CLASSNAME = 'rounded-none bg-transparent px-3 py-1.5 text-sm font-medium';
const SHEET_LINK_CLASSNAME = 'rounded-md px-3 py-2 text-sm font-medium';

export function NavLinks({
  brandName,
  entries,
  openMenuLabel,
  menuTitle,
  mobileActions,
}: NavLinksProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  function isPathActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label={openMenuLabel}
                className="md:hidden"
              />
            }
          >
            <Menu aria-hidden="true" className="size-5" />
          </SheetTrigger>
          <SheetContent title={menuTitle}>
            <nav className="flex flex-col gap-1 pt-8">
              {entries.map((entry) => {
                if (entry.type === 'link') {
                  const isActive = isPathActive(entry.href);
                  return (
                    <SheetClose
                      key={entry.label}
                      render={<Link href={entry.href} />}
                      className={cn(
                        SHEET_LINK_CLASSNAME,
                        isActive ? 'text-primary' : 'text-foreground hover:bg-muted',
                      )}
                    >
                      {entry.label}
                    </SheetClose>
                  );
                }

                return (
                  <div key={entry.label} className="flex flex-col gap-1 py-2">
                    <p className="px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {entry.label}
                    </p>
                    {entry.items.map((item) => (
                      <SheetClose
                        key={item.label}
                        render={<Link href={item.href} />}
                        className={cn(
                          SHEET_LINK_CLASSNAME,
                          isPathActive(item.href)
                            ? 'text-primary'
                            : 'text-foreground hover:bg-muted',
                        )}
                      >
                        {item.label}
                      </SheetClose>
                    ))}
                  </div>
                );
              })}
            </nav>
            {mobileActions ? (
              <TooltipProvider>
                <div className="mt-auto flex items-center gap-1 border-t border-border pt-4">
                  {mobileActions}
                </div>
              </TooltipProvider>
            ) : null}
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2">
          <BookOpen
            aria-hidden="true"
            strokeWidth={1.8}
            className={cn('size-5', isHome ? 'text-primary' : 'text-foreground')}
          />
          <span
            className={cn(
              'hidden font-heading text-lg font-semibold md:inline',
              isHome ? 'text-primary' : 'text-foreground',
            )}
          >
            {brandName}
          </span>
        </Link>
      </div>
      <NavigationMenu className="hidden md:flex" align="start">
        <NavigationMenuList className="gap-0 text-muted-foreground">
          {entries.map((entry) => {
            if (entry.type === 'link') {
              const isActive = isPathActive(entry.href);
              return (
                <NavigationMenuItem key={entry.label}>
                  <Link
                    href={entry.href}
                    className={cn(
                      NAV_ITEM_CLASSNAME,
                      'inline-flex h-9 w-max items-center justify-center transition-colors hover:bg-transparent',
                      isActive ? 'text-primary' : 'hover:text-primary',
                    )}
                  >
                    {entry.label}
                  </Link>
                </NavigationMenuItem>
              );
            }

            const isGroupActive = entry.items.some((item) => isPathActive(item.href));
            return (
              <NavigationMenuItem key={entry.label}>
                <NavigationMenuTrigger
                  className={cn(
                    NAV_ITEM_CLASSNAME,
                    'hover:bg-transparent focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent',
                    isGroupActive ? 'text-primary' : 'hover:text-primary',
                  )}
                >
                  {entry.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="flex w-48 flex-col gap-1 p-2">
                    {entry.items.map((item) => (
                      <li key={item.label}>
                        <NavigationMenuLink
                          render={<Link href={item.href} />}
                          className={cn(
                            'text-sm',
                            isPathActive(item.href)
                              ? 'text-primary'
                              : 'text-muted-foreground hover:text-primary',
                          )}
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}

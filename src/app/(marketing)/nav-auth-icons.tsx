'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogIn, LogOut, User } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { mockSignOut } from '@/lib/mock/mock-session-actions';
import { cn } from '@/lib/utils';

interface NavAuthIconsProps {
  isConsumer: boolean;
  loginLabel: string;
  mypageLabel: string;
  logoutLabel: string;
}

export function NavAuthIcons({
  isConsumer,
  loginLabel,
  mypageLabel,
  logoutLabel,
}: NavAuthIconsProps) {
  const pathname = usePathname();
  const isMypageRoute = pathname.startsWith(CONSUMER_ROUTES.MYPAGE);
  const signOutFromNav = mockSignOut.bind(null, '/');

  if (!isConsumer) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={CONSUMER_ROUTES.LOGIN}
              aria-label={loginLabel}
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            />
          }
        >
          <LogIn aria-hidden="true" className="size-5" />
        </TooltipTrigger>
        <TooltipContent>{loginLabel}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={CONSUMER_ROUTES.MYPAGE}
              aria-label={mypageLabel}
              className={cn(
                'flex size-9 items-center justify-center rounded-md transition-colors hover:bg-muted',
                isMypageRoute ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            />
          }
        >
          <User aria-hidden="true" className="size-5" />
        </TooltipTrigger>
        <TooltipContent>{mypageLabel}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <form action={signOutFromNav}>
              <button
                type="submit"
                aria-label={logoutLabel}
                className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <LogOut aria-hidden="true" className="size-5" />
              </button>
            </form>
          }
        />
        <TooltipContent>{logoutLabel}</TooltipContent>
      </Tooltip>
    </>
  );
}

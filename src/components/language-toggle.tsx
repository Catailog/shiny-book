'use client';

import { useRouter } from 'next/navigation';

import { Check, Languages } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LOCALE_LABELS, LOCALE_OPTIONS } from '@/constants/locale';
import { setLocale } from '@/lib/i18n/actions';
import type { Locale } from '@/locales';

interface LanguageToggleProps {
  locale: Locale;
  label: string;
}

export function LanguageToggle({ locale, label }: LanguageToggleProps) {
  const router = useRouter();

  async function handleSelect(nextLocale: Locale) {
    if (nextLocale === locale) {
      return;
    }

    await setLocale(nextLocale);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              aria-label={label}
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            />
          }
        >
          <Languages aria-hidden="true" className="size-5" />
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        {LOCALE_OPTIONS.map((option) => (
          <DropdownMenuItem key={option} onClick={() => handleSelect(option)}>
            <span className="flex-1">{LOCALE_LABELS[option]}</span>
            {option === locale ? <Check aria-hidden="true" className="size-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

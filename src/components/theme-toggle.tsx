'use client';

import { useRef, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

import { Moon, SunDim } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeToggleProps {
  switchToLightLabel: string;
  switchToDarkLabel: string;
}

const THEME_TRANSITION_DURATION_MS = 700;

export function ThemeToggle({ switchToLightLabel, switchToDarkLabel }: ThemeToggleProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = useSyncExternalStore(subscribeToThemeChange, getIsDarkSnapshot, getServerSnapshot);
  const label = isDark ? switchToLightLabel : switchToDarkLabel;

  async function toggleTheme() {
    const applyTheme = () => {
      const nextIsDark = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', nextIsDark);
      localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
    };

    if (!buttonRef.current || !document.startViewTransition) {
      applyTheme();
      return;
    }

    await document.startViewTransition(() => flushSync(applyTheme)).ready;

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    );

    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
      {
        duration: THEME_TRANSITION_DURATION_MS,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      },
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            ref={buttonRef}
            type="button"
            onClick={toggleTheme}
            aria-label={label}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          />
        }
      >
        {isDark ? (
          <SunDim aria-hidden="true" className="size-5" />
        ) : (
          <Moon aria-hidden="true" className="size-5" />
        )}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function subscribeToThemeChange(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function getIsDarkSnapshot() {
  return document.documentElement.classList.contains('dark');
}

function getServerSnapshot() {
  return false;
}

'use client';

import type { MouseEvent } from 'react';
import { useRef } from 'react';
import { flushSync } from 'react-dom';

import { Moon, SunDim } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useHtmlClassPresent } from '@/hooks/use-html-class-present';
import { pauseAnimations, resumeAnimations } from '@/lib/animation-pause';

const THEME_TRANSITION_PAUSE_REASON = 'theme-transition';

interface ThemeToggleProps {
  switchToLightLabel: string;
  switchToDarkLabel: string;
}

const THEME_TRANSITION_DURATION_MS = 700;

export function ThemeToggle({ switchToLightLabel, switchToDarkLabel }: ThemeToggleProps) {
  const isDark = useHtmlClassPresent('dark');
  const label = isDark ? switchToLightLabel : switchToDarkLabel;
  const isAnimatingRef = useRef(false);

  async function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const applyTheme = () => {
      const nextIsDark = !document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', nextIsDark);
      localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
    };

    if (isAnimatingRef.current) {
      return;
    }

    if (!document.startViewTransition) {
      applyTheme();
      return;
    }

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(Math.max(x, viewportWidth - x), Math.max(y, viewportHeight - y));

    // Chrome renders absolute px clip-path coordinates on ::view-transition-new(root)
    // unscaled on fractional display scales (e.g. Windows 125%/150%) for the first
    // transition after load, landing the circle at the wrong position. Percentages
    // resolve against the reference box at paint time and sidestep the bug.
    const toPercent = (value: number, total: number) => `${(value / total) * 100}%`;
    const origin = `${toPercent(x, viewportWidth)} ${toPercent(y, viewportHeight)}`;
    const radiusPercent = toPercent(
      maxRadius,
      Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2,
    );

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    pauseAnimations(THEME_TRANSITION_PAUSE_REASON);
    isAnimatingRef.current = true;

    try {
      const transition = document.startViewTransition(() => flushSync(applyTheme));
      await transition.ready;

      document.documentElement.animate(
        { clipPath: [`circle(0% at ${origin})`, `circle(${radiusPercent} at ${origin})`] },
        {
          duration: THEME_TRANSITION_DURATION_MS,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        },
      );

      await transition.finished;
    } finally {
      html.style.overflow = previousOverflow;
      resumeAnimations(THEME_TRANSITION_PAUSE_REASON);
      isAnimatingRef.current = false;
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
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

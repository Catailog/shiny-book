'use client';

import { useSyncExternalStore } from 'react';

import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  switchToLightLabel: string;
  switchToDarkLabel: string;
}

export function ThemeToggle({ switchToLightLabel, switchToDarkLabel }: ThemeToggleProps) {
  const isDark = useSyncExternalStore(subscribeToThemeChange, getIsDarkSnapshot, getServerSnapshot);

  function toggleTheme() {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle('dark', nextIsDark);
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? switchToLightLabel : switchToDarkLabel}
      className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-5" />
      ) : (
        <Moon aria-hidden="true" className="size-5" />
      )}
    </button>
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

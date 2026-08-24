'use client';

import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function getServerSnapshot() {
  return false;
}

export function useHtmlClassPresent(className: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains(className),
    getServerSnapshot,
  );
}

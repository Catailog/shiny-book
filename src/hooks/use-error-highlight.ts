'use client';

import { useCallback, useRef, useState } from 'react';

const HIGHLIGHT_DURATION_MS = 2000;

// Scrolls a target section into view and flashes it briefly - reuses the same pulsing
// ring animation as Coachmark, but fired once on demand instead of tied to visibility.
// Takes the target element per call (instead of returning a ref) so the section ref
// itself stays a plain useRef() at the call site.
export function useErrorHighlight() {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback((target: HTMLElement | null) => {
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setIsHighlighted(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsHighlighted(false), HIGHLIGHT_DURATION_MS);
  }, []);

  return { isHighlighted, trigger };
}

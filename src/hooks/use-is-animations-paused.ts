'use client';

import { useHtmlClassPresent } from '@/hooks/use-html-class-present';

export function useIsAnimationsPaused(): boolean {
  return useHtmlClassPresent('animations-paused');
}

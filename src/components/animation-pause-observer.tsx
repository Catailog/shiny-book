'use client';

import { usePauseAnimationsOnHidden } from '@/hooks/use-pause-animations-on-hidden';

export function AnimationPauseObserver() {
  usePauseAnimationsOnHidden();
  return null;
}

'use client';

import { useEffect } from 'react';

import { pauseAnimations, resumeAnimations } from '@/lib/animation-pause';

const REASON = 'tab-hidden';

export function usePauseAnimationsOnHidden(): void {
  useEffect(() => {
    function syncPauseState() {
      if (document.hidden) {
        pauseAnimations(REASON);
      } else {
        resumeAnimations(REASON);
      }
    }

    syncPauseState();
    document.addEventListener('visibilitychange', syncPauseState);

    return () => {
      resumeAnimations(REASON);
      document.removeEventListener('visibilitychange', syncPauseState);
    };
  }, []);
}

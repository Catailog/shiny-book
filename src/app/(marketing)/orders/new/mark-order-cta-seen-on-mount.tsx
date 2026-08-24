'use client';

import { useEffect } from 'react';

import { markOrderCtaSeenAction } from './mark-order-cta-seen-action';

export function MarkOrderCtaSeenOnMount() {
  useEffect(() => {
    void markOrderCtaSeenAction();
  }, []);

  return null;
}

'use client';

import { useEffect, useRef, useState } from 'react';

import Script from 'next/script';

import { env } from '@/env';

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback'?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

export function TurnstileWidget({ onVerify, onExpire }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onVerify, onExpire });
  const [isScriptReady, setIsScriptReady] = useState(
    () => typeof window !== 'undefined' && Boolean(window.turnstile),
  );

  useEffect(() => {
    callbacksRef.current = { onVerify, onExpire };
  }, [onVerify, onExpire]);

  useEffect(() => {
    if (!isScriptReady || !containerRef.current || !window.turnstile) {
      return;
    }

    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      callback: (token) => callbacksRef.current.onVerify(token),
      'expired-callback': () => callbacksRef.current.onExpire?.(),
    });

    return () => {
      window.turnstile?.remove(widgetId);
    };
  }, [isScriptReady]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setIsScriptReady(true)}
      />
      <div ref={containerRef} className="flex justify-center" />
    </>
  );
}

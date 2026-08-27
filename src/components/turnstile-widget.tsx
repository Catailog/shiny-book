'use client';

import { useEffect, useRef, useState } from 'react';

import Script from 'next/script';

import { env } from '@/env';
import { useHtmlClassPresent } from '@/hooks/use-html-class-present';
import { cn } from '@/lib/utils';

interface TurnstileRenderOptions {
  sitekey: string;
  theme: 'light' | 'dark';
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
  const isDark = useHtmlClassPresent('dark');

  useEffect(() => {
    callbacksRef.current = { onVerify, onExpire };
  }, [onVerify, onExpire]);

  useEffect(() => {
    if (!isScriptReady || !containerRef.current || !window.turnstile) {
      return;
    }

    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      theme: isDark ? 'dark' : 'light',
      callback: (token) => callbacksRef.current.onVerify(token),
      'expired-callback': () => callbacksRef.current.onExpire?.(),
    });

    return () => {
      window.turnstile?.remove(widgetId);
    };
  }, [isScriptReady, isDark]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={() => setIsScriptReady(true)}
      />
      {/* min-h-[65px]: Cloudflare Turnstile 기본 위젯의 공식 렌더링 높이, 스크립트 로드 전 레이아웃 시프트 방지 */}
      <div ref={containerRef} className={cn('flex justify-center', 'min-h-[65px]')} />
    </>
  );
}

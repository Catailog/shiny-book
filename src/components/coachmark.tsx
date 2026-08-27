'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { X } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const COACHMARK_STORAGE_PREFIX = 'coachmark-dismissed-';

function isDismissed(id: string): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  return window.localStorage.getItem(`${COACHMARK_STORAGE_PREFIX}${id}`) === '1';
}

function persistDismissed(id: string): void {
  window.localStorage.setItem(`${COACHMARK_STORAGE_PREFIX}${id}`, '1');
}

const CoachmarkVisibleContext = createContext(false);

interface CoachmarkHighlightProps {
  radiusClassName?: string;
  autoBorderRadius: string | null;
}

export function CoachmarkHighlight({ radiusClassName, autoBorderRadius }: CoachmarkHighlightProps) {
  return (
    <span
      aria-hidden="true"
      style={!radiusClassName && autoBorderRadius ? { borderRadius: autoBorderRadius } : undefined}
      className={cn(
        'pointer-events-none absolute inset-0 animate-coachmark-pulse ring-2 ring-primary',
        radiusClassName,
      )}
    />
  );
}

function useAutoBorderRadius(
  measureRef: React.RefObject<HTMLElement | null>,
  isVisible: boolean,
  radiusClassName: string | undefined,
): string | null {
  const [autoBorderRadius, setAutoBorderRadius] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible || radiusClassName) {
      return;
    }

    const measureTarget = measureRef.current?.firstElementChild;
    if (measureTarget instanceof HTMLElement) {
      setAutoBorderRadius(getComputedStyle(measureTarget).borderRadius);
    }
  }, [isVisible, radiusClassName, measureRef]);

  return autoBorderRadius;
}

interface CoachmarkSpotProps {
  radiusClassName?: string;
  children: React.ReactNode;
}

// Highlights a single element inside a highlightMode="children" Coachmark with its
// own ring, shaped to that element alone - use one CoachmarkSpot per element that
// should be individually outlined, instead of one ring spanning the whole group.
export function CoachmarkSpot({ radiusClassName, children }: CoachmarkSpotProps) {
  const isVisible = useContext(CoachmarkVisibleContext);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const autoBorderRadius = useAutoBorderRadius(wrapperRef, isVisible, radiusClassName);

  return (
    <span ref={wrapperRef} className="relative inline-flex">
      {isVisible ? (
        <CoachmarkHighlight radiusClassName={radiusClassName} autoBorderRadius={autoBorderRadius} />
      ) : null}
      {children}
    </span>
  );
}

interface CoachmarkProps {
  id: string;
  title: string;
  description: string;
  closeLabel: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  radiusClassName?: string;
  highlightMode?: 'auto' | 'children';
  children: React.ReactNode;
}

export function Coachmark({
  id,
  title,
  description,
  closeLabel,
  side = 'bottom',
  align = 'center',
  radiusClassName,
  highlightMode = 'auto',
  children,
}: CoachmarkProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isTargetDismissed, setIsTargetDismissed] = useState(() => isDismissed(id));
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || isTargetDismissed) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry?.isIntersecting ?? false),
      { threshold: 0.6 },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [isTargetDismissed]);

  const isVisible = !isTargetDismissed && isInViewport;
  const autoBorderRadius = useAutoBorderRadius(
    targetRef,
    isVisible && highlightMode === 'auto',
    radiusClassName,
  );

  function handleDismiss() {
    persistDismissed(id);
    setIsTargetDismissed(true);
  }

  return (
    <div ref={targetRef} onClickCapture={handleDismiss} className="relative">
      {isVisible && highlightMode === 'auto' ? (
        <CoachmarkHighlight radiusClassName={radiusClassName} autoBorderRadius={autoBorderRadius} />
      ) : null}
      <CoachmarkVisibleContext.Provider value={isVisible}>
        {children}
      </CoachmarkVisibleContext.Provider>
      <Popover open={isVisible}>
        <PopoverContent anchor={targetRef} side={side} align={align} className="w-64">
          <div className="flex items-start justify-between gap-2">
            <PopoverHeader>
              <PopoverTitle>{title}</PopoverTitle>
              <PopoverDescription>{description}</PopoverDescription>
            </PopoverHeader>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={handleDismiss}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

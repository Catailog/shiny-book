'use client';

import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';

const VARIANT_ICONS = {
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
  success: CircleCheck,
} as const;

interface ImportantToastIconProps {
  variant: keyof typeof VARIANT_ICONS;
  label: string;
}

export function ImportantToastIcon({ variant, label }: ImportantToastIconProps) {
  const Icon = VARIANT_ICONS[variant];

  return (
    <span className="flex flex-col items-center gap-0.5 self-start">
      <Icon aria-hidden="true" className="size-4" />
      <span className="text-[10px] leading-none font-bold tracking-wide uppercase">{label}</span>
    </span>
  );
}

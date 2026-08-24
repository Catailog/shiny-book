'use client';

import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { useT } from '@/hooks/use-t';

interface BackButtonProps {
  orderId: string;
}

export function BackButton({ orderId }: BackButtonProps) {
  const t = useT();

  return (
    <Link
      href={`${CONSUMER_ROUTES.NEW_ORDER}?fromOrder=${orderId}`}
      className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft aria-hidden="true" className="size-3.5" />
      {t.checkout.backButton}
    </Link>
  );
}

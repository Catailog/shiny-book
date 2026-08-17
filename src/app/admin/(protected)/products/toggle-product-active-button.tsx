'use client';

import { useActionState, useEffect } from 'react';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { defaultLocale, locales } from '@/locales';

import { type ToggleProductActiveState, toggleProductActive } from './actions';

interface ToggleProductActiveButtonProps {
  productId: string;
  isActive: boolean;
}

const initialState: ToggleProductActiveState = { error: null };

export function ToggleProductActiveButton({ productId, isActive }: ToggleProductActiveButtonProps) {
  const t = locales[defaultLocale];
  const [state, formAction, isPending] = useActionState(
    toggleProductActive.bind(null, productId, isActive),
    initialState,
  );

  useEffect(() => {
    if (state.error) {
      toast.error(t.admin.products.errors[state.error]);
    }
  }, [state.error, t]);

  return (
    <form action={formAction} onClick={(event) => event.stopPropagation()}>
      <Button type="submit" variant="outline" size="sm" disabled={isPending}>
        {isActive ? t.admin.products.hideButton : t.admin.products.showButton}
      </Button>
    </form>
  );
}

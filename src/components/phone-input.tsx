'use client';

import type { ComponentProps } from 'react';

import { Input } from '@/components/ui/input';
import { PHONE_MAX_LENGTH } from '@/constants/phone';

type PhoneInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'inputMode'>;

// Phone field that only keeps digits: hyphens, spaces, and letters are stripped as the
// value is typed or pasted, and the length is capped at PHONE_MAX_LENGTH digits (not
// counting separators, unlike a raw maxLength attribute). Pair with `phoneSchema`, which
// normalizes the same way on the server.
export function PhoneInput({ onChange, ...props }: PhoneInputProps) {
  return (
    <Input
      type="tel"
      inputMode="numeric"
      autoComplete="tel"
      onChange={(event) => {
        const digits = event.target.value.replace(/\D/g, '').slice(0, PHONE_MAX_LENGTH);
        if (digits !== event.target.value) {
          event.target.value = digits;
        }
        onChange?.(event);
      }}
      {...props}
    />
  );
}

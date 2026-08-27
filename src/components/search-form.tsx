import type { ReactNode } from 'react';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchFormProps {
  defaultValue: string;
  placeholder: string;
  submitLabel: string;
  inputClassName?: string;
  children?: ReactNode;
}

export function SearchForm({
  defaultValue,
  placeholder,
  submitLabel,
  inputClassName,
  children,
}: SearchFormProps) {
  return (
    <form className="flex items-center gap-2">
      {children}
      <div className="relative">
        <button
          type="submit"
          aria-label={submitLabel}
          className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <Search aria-hidden="true" className="size-4" />
        </button>
        <Input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={cn('pl-9', inputClassName)}
        />
      </div>
    </form>
  );
}

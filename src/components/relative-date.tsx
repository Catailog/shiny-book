import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDateTime, formatRelativeDate } from '@/lib/format-date';
import type { Locale } from '@/locales';

interface RelativeDateProps {
  value: string;
  locale: Locale;
}

export function RelativeDate({ value, locale }: RelativeDateProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="cursor-default" />}>
        {formatRelativeDate(value, locale)}
      </TooltipTrigger>
      <TooltipContent>{formatDateTime(value)}</TooltipContent>
    </Tooltip>
  );
}

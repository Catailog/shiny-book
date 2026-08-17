import { Badge } from '@/components/ui/badge';
import {
  ANNOUNCEMENT_CATEGORY,
  type AnnouncementCategory,
  isAnnouncementCategory,
} from '@/constants/announcement-category';
import { cn } from '@/lib/utils';
import { type Locale, defaultLocale, locales } from '@/locales';

const TONE_CLASSES = {
  notice: 'bg-primary-soft text-primary',
  event: 'bg-secondary text-secondary-foreground',
  winner: 'bg-order-status-done/10 text-order-status-done',
} as const satisfies Record<AnnouncementCategory, string>;

interface AnnouncementCategoryBadgeProps {
  category: string;
  locale?: Locale;
  className?: string;
}

export function AnnouncementCategoryBadge({
  category,
  locale = defaultLocale,
  className,
}: AnnouncementCategoryBadgeProps) {
  const t = locales[locale];
  const resolvedCategory = isAnnouncementCategory(category)
    ? category
    : ANNOUNCEMENT_CATEGORY.NOTICE;

  return (
    <Badge
      className={cn('rounded-full border-transparent', TONE_CLASSES[resolvedCategory], className)}
    >
      {t.announcementCategories[resolvedCategory]}
    </Badge>
  );
}

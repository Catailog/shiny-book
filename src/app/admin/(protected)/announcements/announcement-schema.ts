import { z } from 'zod';

import {
  ANNOUNCEMENT_CONTENT_MAX_LENGTH,
  ANNOUNCEMENT_TITLE_MAX_LENGTH,
} from '@/constants/announcement';
import { ANNOUNCEMENT_CATEGORY } from '@/constants/announcement-category';

export const announcementFormSchema = z.object({
  title: z.string().min(1).max(ANNOUNCEMENT_TITLE_MAX_LENGTH),
  category: z.enum([
    ANNOUNCEMENT_CATEGORY.NOTICE,
    ANNOUNCEMENT_CATEGORY.EVENT,
    ANNOUNCEMENT_CATEGORY.WINNER,
  ]),
  content: z.string().min(1).max(ANNOUNCEMENT_CONTENT_MAX_LENGTH),
});

export type AnnouncementFormInput = z.infer<typeof announcementFormSchema>;

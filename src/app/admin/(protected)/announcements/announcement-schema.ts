import { z } from 'zod';

import {
  ANNOUNCEMENT_CONTENT_MAX_LENGTH,
  ANNOUNCEMENT_TITLE_MAX_LENGTH,
} from '@/constants/announcement';

export const announcementFormSchema = z.object({
  title: z.string().min(1).max(ANNOUNCEMENT_TITLE_MAX_LENGTH),
  content: z.string().min(1).max(ANNOUNCEMENT_CONTENT_MAX_LENGTH),
});

export type AnnouncementFormInput = z.infer<typeof announcementFormSchema>;

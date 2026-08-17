import { z } from 'zod';

export const notificationPreferencesSchema = z.object({
  marketingEmailConsent: z.boolean(),
  marketingSmsConsent: z.boolean(),
});

export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;

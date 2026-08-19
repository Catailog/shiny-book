import { z } from 'zod';

export const addressFormSchema = z.object({
  label: z.string().min(1),
  recipientName: z.string().min(1),
  phone: z.string().min(1),
  postalCode: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  isDefault: z.boolean(),
});

export type AddressFormInput = z.infer<typeof addressFormSchema>;

import { z } from 'zod';

import {
  ADDRESS_LABEL_MAX_LENGTH,
  ADDRESS_LINE_MAX_LENGTH,
  POSTAL_CODE_REGEX,
} from '@/constants/address';
import { PERSON_NAME_MAX_LENGTH } from '@/constants/person-name';
import { phoneSchema } from '@/schemas/phone';

export const addressFormSchema = z.object({
  label: z.string().min(1).max(ADDRESS_LABEL_MAX_LENGTH),
  recipientName: z.string().min(1).max(PERSON_NAME_MAX_LENGTH),
  phone: phoneSchema,
  postalCode: z.string().regex(POSTAL_CODE_REGEX),
  addressLine1: z.string().min(1).max(ADDRESS_LINE_MAX_LENGTH),
  addressLine2: z.string().max(ADDRESS_LINE_MAX_LENGTH).optional(),
  isDefault: z.boolean(),
});

export type AddressFormInput = z.infer<typeof addressFormSchema>;

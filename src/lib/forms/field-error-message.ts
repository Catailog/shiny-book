interface FieldErrorMessages {
  required: string;
  tooShort?: string;
  tooLong?: string;
  min?: string;
  max?: string;
  format?: string;
  invalid?: string;
  custom?: string;
}

// Picks a field-specific message from `messages` based on the Zod issue code that
// react-hook-form's zodResolver puts on `error.type`. Always falls back to
// `required` so a field never renders an empty error line.
export function fieldErrorMessage(messages: FieldErrorMessages, type: string | undefined): string {
  switch (type) {
    case 'too_small':
      return messages.min ?? messages.tooShort ?? messages.required;
    case 'too_big':
      return (
        messages.tooLong ?? messages.max ?? messages.format ?? messages.invalid ?? messages.required
      );
    case 'invalid_string':
      return messages.format ?? messages.invalid ?? messages.required;
    case 'invalid_type':
    case 'not_finite':
      return messages.invalid ?? messages.required;
    case 'custom':
      return messages.custom ?? messages.invalid ?? messages.format ?? messages.required;
    default:
      return messages.invalid ?? messages.required;
  }
}

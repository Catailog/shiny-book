import { describe, expect, it } from 'vitest';

import { fieldErrorMessage } from '@/lib/forms/field-error-message';

const messages = {
  required: 'required',
  tooLong: 'tooLong',
  min: 'min',
  max: 'max',
  format: 'format',
  invalid: 'invalid',
  custom: 'custom',
};

describe('fieldErrorMessage', () => {
  it('maps too_small to the min message', () => {
    expect(fieldErrorMessage(messages, 'too_small')).toBe('min');
  });

  it('falls back to required for too_small when no min/tooShort is set', () => {
    expect(fieldErrorMessage({ required: 'required' }, 'too_small')).toBe('required');
  });

  it('maps too_big to the tooLong message', () => {
    expect(fieldErrorMessage(messages, 'too_big')).toBe('tooLong');
  });

  it('maps too_big to the max message when tooLong is absent', () => {
    expect(fieldErrorMessage({ required: 'required', max: 'max' }, 'too_big')).toBe('max');
  });

  it('maps invalid_string to the format message', () => {
    expect(fieldErrorMessage(messages, 'invalid_string')).toBe('format');
  });

  it('maps invalid_type to the invalid message', () => {
    expect(fieldErrorMessage(messages, 'invalid_type')).toBe('invalid');
  });

  it('maps custom to the custom message', () => {
    expect(fieldErrorMessage(messages, 'custom')).toBe('custom');
  });

  it('falls back to required for an unknown or undefined type', () => {
    expect(fieldErrorMessage({ required: 'required' }, undefined)).toBe('required');
    expect(fieldErrorMessage({ required: 'required' }, 'something_else')).toBe('required');
  });
});

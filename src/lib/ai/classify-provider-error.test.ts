import { APICallError } from 'ai';
import { describe, expect, it } from 'vitest';

import { AI_PROVIDER } from '@/constants/ai';

import { classifyProviderError } from './classify-provider-error';

function apiError(overrides: {
  statusCode?: number;
  data?: unknown;
  responseBody?: string;
}): APICallError {
  return new APICallError({
    message: 'request failed',
    url: 'https://example.com',
    requestBodyValues: {},
    statusCode: overrides.statusCode,
    responseBody: overrides.responseBody ?? '',
    data: overrides.data,
  });
}

describe('classifyProviderError', () => {
  it('treats a non-API error as transient', () => {
    expect(classifyProviderError(AI_PROVIDER.GEMINI, new Error('network down'))).toEqual({
      kind: 'transient',
      errorClass: 'non_api_error',
    });
  });

  it.each([408, 409, 429, 500, 502, 503, 504])(
    'treats HTTP %i as transient for every provider',
    (statusCode) => {
      for (const provider of [AI_PROVIDER.GEMINI, AI_PROVIDER.GROQ, AI_PROVIDER.CLOUDFLARE]) {
        const result = classifyProviderError(provider, apiError({ statusCode }));
        expect(result.kind).toBe('transient');
      }
    },
  );

  describe('Gemini', () => {
    it('classifies a decommissioned model as structural model_gone', () => {
      const error = apiError({
        statusCode: 404,
        data: { error: { code: 404, message: 'model not found', status: 'NOT_FOUND' } },
      });
      expect(classifyProviderError(AI_PROVIDER.GEMINI, error)).toEqual({
        kind: 'structural',
        errorClass: 'model_gone',
      });
    });

    it('classifies 401 as structural auth', () => {
      const error = apiError({ statusCode: 401, data: { error: { message: 'no key' } } });
      expect(classifyProviderError(AI_PROVIDER.GEMINI, error)).toEqual({
        kind: 'structural',
        errorClass: 'auth',
      });
    });

    it('classifies a leaked-key 403 as structural auth', () => {
      const error = apiError({
        statusCode: 403,
        data: { error: { message: 'API key reported as leaked' } },
      });
      expect(classifyProviderError(AI_PROVIDER.GEMINI, error)).toEqual({
        kind: 'structural',
        errorClass: 'auth',
      });
    });

    it('classifies a plain 403 permission_denied as structural plan_or_tier', () => {
      const error = apiError({
        statusCode: 403,
        data: { error: { message: 'not available in your region', status: 'PERMISSION_DENIED' } },
      });
      expect(classifyProviderError(AI_PROVIDER.GEMINI, error)).toEqual({
        kind: 'structural',
        errorClass: 'plan_or_tier',
      });
    });

    it('classifies a billing failed_precondition 400 as structural plan_or_tier', () => {
      const error = apiError({
        statusCode: 400,
        data: { error: { message: 'billing not enabled', status: 'FAILED_PRECONDITION' } },
      });
      expect(classifyProviderError(AI_PROVIDER.GEMINI, error)).toEqual({
        kind: 'structural',
        errorClass: 'plan_or_tier',
      });
    });

    it('classifies an invalid_request 400 as structural request_contract', () => {
      const error = apiError({
        statusCode: 400,
        data: { error: { message: 'bad param', status: 'INVALID_ARGUMENT' } },
      });
      expect(classifyProviderError(AI_PROVIDER.GEMINI, error)).toEqual({
        kind: 'structural',
        errorClass: 'request_contract',
      });
    });

    it('classifies 416 as structural request_contract', () => {
      const error = apiError({ statusCode: 416, data: { error: { message: 'out of range' } } });
      expect(classifyProviderError(AI_PROVIDER.GEMINI, error)).toEqual({
        kind: 'structural',
        errorClass: 'request_contract',
      });
    });
  });

  describe('Groq', () => {
    it('treats 422 and 498 as transient', () => {
      expect(classifyProviderError(AI_PROVIDER.GROQ, apiError({ statusCode: 422 })).kind).toBe(
        'transient',
      );
      expect(classifyProviderError(AI_PROVIDER.GROQ, apiError({ statusCode: 498 })).kind).toBe(
        'transient',
      );
    });

    it('classifies a decommissioned model as structural model_gone even parsed from responseBody', () => {
      const error = apiError({
        statusCode: 400,
        responseBody: JSON.stringify({
          error: { message: 'model decommissioned', code: 'model_decommissioned' },
        }),
      });
      expect(classifyProviderError(AI_PROVIDER.GROQ, error)).toEqual({
        kind: 'structural',
        errorClass: 'model_gone',
      });
    });

    it('classifies 401/403 as structural auth', () => {
      expect(classifyProviderError(AI_PROVIDER.GROQ, apiError({ statusCode: 401 }))).toEqual({
        kind: 'structural',
        errorClass: 'auth',
      });
      expect(classifyProviderError(AI_PROVIDER.GROQ, apiError({ statusCode: 403 }))).toEqual({
        kind: 'structural',
        errorClass: 'auth',
      });
    });

    it('classifies a non-decommissioned 400 as structural request_contract', () => {
      const error = apiError({
        statusCode: 400,
        data: { error: { message: 'bad request', code: 'invalid_request_error' } },
      });
      expect(classifyProviderError(AI_PROVIDER.GROQ, error)).toEqual({
        kind: 'structural',
        errorClass: 'request_contract',
      });
    });

    it('classifies 413 as structural request_contract', () => {
      expect(classifyProviderError(AI_PROVIDER.GROQ, apiError({ statusCode: 413 }))).toEqual({
        kind: 'structural',
        errorClass: 'request_contract',
      });
    });
  });

  describe('Cloudflare', () => {
    it('treats known transient codes as transient', () => {
      for (const code of [3007, 3008, 3040, 3036]) {
        const error = apiError({
          statusCode: 400,
          data: { success: false, errors: [{ code, message: 'busy' }] },
        });
        expect(classifyProviderError(AI_PROVIDER.CLOUDFLARE, error).kind).toBe('transient');
      }
    });

    it.each([
      [5007, 'model_gone'],
      [3042, 'model_gone'],
      [5035, 'plan_or_tier'],
      [5016, 'plan_or_tier'],
      [5018, 'plan_or_tier'],
      [3041, 'plan_or_tier'],
      [5004, 'request_contract'],
      [3003, 'request_contract'],
      [5019, 'request_contract'],
    ])('classifies code %i as structural %s', (code, errorClass) => {
      const error = apiError({
        statusCode: 400,
        data: { success: false, errors: [{ code, message: 'x' }] },
      });
      expect(classifyProviderError(AI_PROVIDER.CLOUDFLARE, error)).toEqual({
        kind: 'structural',
        errorClass,
      });
    });

    it('classifies 401 as structural auth', () => {
      expect(classifyProviderError(AI_PROVIDER.CLOUDFLARE, apiError({ statusCode: 401 }))).toEqual({
        kind: 'structural',
        errorClass: 'auth',
      });
    });
  });
});

import { APICallError } from 'ai';

import { AI_PROVIDER, type AiProvider } from '@/constants/ai';

export type ProviderErrorKind = 'transient' | 'structural';

export interface ProviderErrorClassification {
  kind: ProviderErrorKind;
  errorClass: string;
}

// Status codes that mean "busy/blocked right now" for every provider - retry
// later, don't page anyone. 5xx is the provider's own infra hiccup; 429/408/409
// resolve with time. Everything else in the 4xx range is treated as a signal
// the provider changed a contract underneath us (model retired, key revoked,
// billing/tier gate, malformed request) and needs a human, not a retry.
const ALWAYS_TRANSIENT_STATUS_CODES = new Set([408, 409, 429, 500, 502, 503, 504]);

// Groq returns these as literal HTTP status codes (unlike Cloudflare, whose
// meaningful codes live inside the JSON body, not the status line).
const GROQ_TRANSIENT_STATUS_CODES = new Set([422, 498]);

// Cloudflare's own numeric error taxonomy, carried in the response body
// (`errors[0].code`), independent of the HTTP status line.
const CLOUDFLARE_TRANSIENT_CODES = new Set([3007, 3008, 3040, 3036]);
const CLOUDFLARE_MODEL_GONE_CODES = new Set([5007, 3042]);
const CLOUDFLARE_PLAN_OR_TIER_CODES = new Set([5035, 5016, 5018, 3041]);
const CLOUDFLARE_REQUEST_CONTRACT_CODES = new Set([5004, 3003, 5019]);

interface ParsedErrorBody {
  message: string;
  code: string | null;
  status: string | null;
  cloudflareCode: number | null;
}

// Classifies an AI SDK provider failure as `transient` (retry/fall back
// quietly - not alert-worthy) or `structural` (will keep failing until a human
// fixes it - alert-worthy, see the AI provider structural-failure PLAN item).
// Non-API errors (network failures, SDK bugs) are treated as transient: there
// isn't enough signal to call the provider itself dead.
export function classifyProviderError(
  provider: AiProvider,
  error: unknown,
): ProviderErrorClassification {
  if (!APICallError.isInstance(error)) {
    return { kind: 'transient', errorClass: 'non_api_error' };
  }

  const statusCode = error.statusCode;
  const body = parseErrorBody(error);

  if (statusCode !== undefined && ALWAYS_TRANSIENT_STATUS_CODES.has(statusCode)) {
    return { kind: 'transient', errorClass: `http_${statusCode}` };
  }

  if (
    provider === AI_PROVIDER.GROQ &&
    statusCode !== undefined &&
    GROQ_TRANSIENT_STATUS_CODES.has(statusCode)
  ) {
    return { kind: 'transient', errorClass: `http_${statusCode}` };
  }

  if (
    provider === AI_PROVIDER.CLOUDFLARE &&
    body.cloudflareCode !== null &&
    CLOUDFLARE_TRANSIENT_CODES.has(body.cloudflareCode)
  ) {
    return { kind: 'transient', errorClass: `cf_${body.cloudflareCode}` };
  }

  return classifyStructural(provider, statusCode, body);
}

function classifyStructural(
  provider: AiProvider,
  statusCode: number | undefined,
  body: ParsedErrorBody,
): ProviderErrorClassification {
  switch (provider) {
    case AI_PROVIDER.GEMINI:
      return classifyGemini(statusCode, body);
    case AI_PROVIDER.GROQ:
      return classifyGroq(statusCode, body);
    case AI_PROVIDER.CLOUDFLARE:
      return classifyCloudflare(statusCode, body);
  }
}

function classifyGemini(
  statusCode: number | undefined,
  body: ParsedErrorBody,
): ProviderErrorClassification {
  if (statusCode === 404) {
    return { kind: 'structural', errorClass: 'model_gone' };
  }
  if (statusCode === 401) {
    return { kind: 'structural', errorClass: 'auth' };
  }
  if (statusCode === 403) {
    const isKeyLeaked = body.message.toLowerCase().includes('leak');
    return {
      kind: 'structural',
      errorClass: isKeyLeaked || body.status === 'UNAUTHENTICATED' ? 'auth' : 'plan_or_tier',
    };
  }
  if (statusCode === 400 && body.status === 'FAILED_PRECONDITION') {
    return { kind: 'structural', errorClass: 'plan_or_tier' };
  }
  if (statusCode === 400 || statusCode === 416) {
    return { kind: 'structural', errorClass: 'request_contract' };
  }

  return { kind: 'structural', errorClass: 'unknown' };
}

function classifyGroq(
  statusCode: number | undefined,
  body: ParsedErrorBody,
): ProviderErrorClassification {
  if (body.code === 'model_decommissioned' || body.code === 'model_not_found') {
    return { kind: 'structural', errorClass: 'model_gone' };
  }
  if (statusCode === 401 || statusCode === 403) {
    return { kind: 'structural', errorClass: 'auth' };
  }
  if (statusCode === 400 || statusCode === 413) {
    return { kind: 'structural', errorClass: 'request_contract' };
  }

  return { kind: 'structural', errorClass: 'unknown' };
}

function classifyCloudflare(
  statusCode: number | undefined,
  body: ParsedErrorBody,
): ProviderErrorClassification {
  if (body.cloudflareCode !== null && CLOUDFLARE_MODEL_GONE_CODES.has(body.cloudflareCode)) {
    return { kind: 'structural', errorClass: 'model_gone' };
  }
  if (body.cloudflareCode !== null && CLOUDFLARE_PLAN_OR_TIER_CODES.has(body.cloudflareCode)) {
    return { kind: 'structural', errorClass: 'plan_or_tier' };
  }
  if (body.cloudflareCode !== null && CLOUDFLARE_REQUEST_CONTRACT_CODES.has(body.cloudflareCode)) {
    return { kind: 'structural', errorClass: 'request_contract' };
  }
  if (statusCode === 401) {
    return { kind: 'structural', errorClass: 'auth' };
  }

  return { kind: 'structural', errorClass: 'unknown' };
}

function parseErrorBody(error: APICallError): ParsedErrorBody {
  const raw = readRawBody(error);

  if (raw === null) {
    return { message: error.message, code: null, status: null, cloudflareCode: null };
  }

  // Gemini: { error: { code, message, status } }
  // Groq (OpenAI-compatible): { error: { message, type, code } }
  const nestedError = isRecord(raw) && isRecord(raw.error) ? raw.error : isRecord(raw) ? raw : null;
  const message =
    nestedError && typeof nestedError.message === 'string' ? nestedError.message : error.message;
  const code = nestedError && typeof nestedError.code === 'string' ? nestedError.code : null;
  const status = nestedError && typeof nestedError.status === 'string' ? nestedError.status : null;

  // Cloudflare: { success: false, errors: [{ code, message }] }
  const cloudflareErrors = isRecord(raw) && Array.isArray(raw.errors) ? raw.errors : null;
  const firstCloudflareError =
    cloudflareErrors && cloudflareErrors.length > 0 ? cloudflareErrors[0] : null;
  const cloudflareCode =
    isRecord(firstCloudflareError) && typeof firstCloudflareError.code === 'number'
      ? firstCloudflareError.code
      : null;

  return { message, code, status, cloudflareCode };
}

function readRawBody(error: APICallError): unknown {
  if (error.data !== undefined) {
    return error.data;
  }
  if (typeof error.responseBody !== 'string') {
    return null;
  }
  try {
    return JSON.parse(error.responseBody);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

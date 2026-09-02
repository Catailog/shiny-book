const MAX_REQUEST_ID_LENGTH = 200;
const PRINTABLE_ASCII = /^[!-~]+$/;

// Reuse an inbound correlation id when the caller (an upstream service, or the
// deploy platform) sent a sane one, so logs line up across systems. Otherwise
// mint a fresh id. Rejects empty, overlong, or non-printable values to keep a
// forged header out of the logs.
export function resolveRequestId(inboundHeader: string | null | undefined): string {
  if (inboundHeader) {
    const trimmed = inboundHeader.trim();
    if (
      trimmed.length > 0 &&
      trimmed.length <= MAX_REQUEST_ID_LENGTH &&
      PRINTABLE_ASCII.test(trimmed)
    ) {
      return trimmed;
    }
  }

  return crypto.randomUUID();
}

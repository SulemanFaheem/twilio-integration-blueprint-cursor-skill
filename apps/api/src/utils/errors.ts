import type { ErrorCode, VerifyResponse, VerifyStatus } from '@twilio-blueprint/shared';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number,
    public readonly retryAfterMs = 0,
    public readonly to: string | null = null,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function successResponse(status: VerifyStatus, to: string): VerifyResponse {
  return { ok: true, status, to, error: null };
}

export function errorResponse(err: AppError): VerifyResponse {
  return {
    ok: false,
    status: null,
    to: err.to,
    error: {
      code: err.code,
      message: err.message,
      retryAfterMs: err.retryAfterMs,
    },
  };
}

/** Map upstream failures to a stable client-facing error (never leak raw Twilio payloads). */
export function mapTwilioError(err: unknown, to: string | null = null): AppError {
  const detail =
    err && typeof err === 'object' && 'message' in err
      ? String((err as { message: unknown }).message)
      : String(err);
  console.error('[twilio]', detail);
  return new AppError(
    'TWILIO_ERROR',
    'Verification service is temporarily unavailable. Please try again.',
    502,
    0,
    to,
  );
}

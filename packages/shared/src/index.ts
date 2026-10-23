/** Shared Verify API types used by `apps/api`. Mobile clients ship their own copy for easy paste. */

export type VerifyStatus = 'pending' | 'approved' | 'canceled';

export type ErrorCode =
  | 'INVALID_PHONE'
  | 'RATE_LIMITED'
  | 'INVALID_CODE'
  | 'VALIDATION_ERROR'
  | 'TWILIO_ERROR';

export interface ApiErrorBody {
  code: ErrorCode;
  message: string;
  retryAfterMs: number;
}

export interface VerifyResponse {
  ok: boolean;
  status: VerifyStatus | null;
  to: string | null;
  error: ApiErrorBody | null;
}

export interface StartVerifyRequest {
  phone: string;
}

export interface CheckVerifyRequest {
  phone: string;
  code: string;
}

export const ERROR_CODES: readonly ErrorCode[] = [
  'INVALID_PHONE',
  'RATE_LIMITED',
  'INVALID_CODE',
  'VALIDATION_ERROR',
  'TWILIO_ERROR',
] as const;

export function messageForErrorCode(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    INVALID_PHONE: 'Enter a valid phone number with country code.',
    RATE_LIMITED: 'Too many attempts. Please wait and try again.',
    INVALID_CODE: 'That code is incorrect or expired.',
    VALIDATION_ERROR: 'Check your input and try again.',
    TWILIO_ERROR: 'Verification service is temporarily unavailable.',
  };
  return messages[code];
}

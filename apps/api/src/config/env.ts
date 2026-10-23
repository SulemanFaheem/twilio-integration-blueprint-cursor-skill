import path from 'node:path';
import dotenv from 'dotenv';

/** Load apps/api/.env first, then process cwd (supports `npm run dev:api` from repo root). */
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export interface Env {
  port: number;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioVerifyServiceSid: string;
  allowedCountryCodes: string[] | null;
  publicApiUrl: string | null;
  rateLimitStartPerPhone: number;
  rateLimitCheckPerPhone: number;
  rateLimitWindowMs: number;
}

export function loadEnv(options: { requireTwilio?: boolean } = {}): Env {
  const { requireTwilio = true } = options;
  const allowed = process.env.ALLOWED_COUNTRY_CODES?.trim();

  if (requireTwilio) {
    required('TWILIO_ACCOUNT_SID');
    required('TWILIO_AUTH_TOKEN');
    required('TWILIO_VERIFY_SERVICE_SID');
  }

  return {
    port: intEnv('PORT', 3000),
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID?.trim() || '',
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN?.trim() || '',
    twilioVerifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID?.trim() || '',
    allowedCountryCodes: allowed
      ? allowed
          .split(',')
          .map((c) => c.trim().toUpperCase())
          .filter(Boolean)
      : null,
    publicApiUrl: process.env.PUBLIC_API_URL?.trim() || null,
    rateLimitStartPerPhone: intEnv('RATE_LIMIT_START_PER_PHONE', 5),
    rateLimitCheckPerPhone: intEnv('RATE_LIMIT_CHECK_PER_PHONE', 10),
    rateLimitWindowMs: intEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
  };
}

import type { CheckVerifyRequest, StartVerifyRequest, VerifyResponse } from '../types';

const API_BASE = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);

async function postJson<TBody>(path: string, body: TBody): Promise<VerifyResponse> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  try {
    return (await res.json()) as VerifyResponse;
  } catch {
    return {
      ok: false,
      status: null,
      to: null,
      error: {
        code: 'TWILIO_ERROR',
        message: `Unexpected response (${res.status})`,
        retryAfterMs: 0,
      },
    };
  }
}

export function startVerification(phone: string): Promise<VerifyResponse> {
  const body: StartVerifyRequest = { phone };
  return postJson('/v1/verify/start', body);
}

export function checkVerification(phone: string, code: string): Promise<VerifyResponse> {
  const body: CheckVerifyRequest = { phone, code };
  return postJson('/v1/verify/check', body);
}

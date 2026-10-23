import { describe, expect, it, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app';
import type { Env } from '../src/config/env';
import type { TwilioVerifyClient } from '../src/services/twilioVerify';

const env: Env = {
  port: 3000,
  twilioAccountSid: 'ACtest',
  twilioAuthToken: 'token',
  twilioVerifyServiceSid: 'VAtest',
  allowedCountryCodes: null,
  publicApiUrl: null,
  rateLimitStartPerPhone: 5,
  rateLimitCheckPerPhone: 10,
  rateLimitWindowMs: 60_000,
};

describe('verify routes', () => {
  let verify: TwilioVerifyClient;

  beforeEach(() => {
    verify = {
      start: vi.fn().mockResolvedValue('pending'),
      check: vi.fn().mockResolvedValue('approved'),
    };
  });

  it('GET /health', async () => {
    const app = createApp(env, verify);
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('POST /v1/verify/start', async () => {
    const app = createApp(env, verify);
    const res = await request(app)
      .post('/v1/verify/start')
      .send({ phone: '+14155552671' });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      ok: true,
      status: 'pending',
      to: '+14155552671',
      error: null,
    });
    expect(verify.start).toHaveBeenCalledWith('+14155552671');
  });

  it('rejects invalid phone', async () => {
    const app = createApp(env, verify);
    const res = await request(app).post('/v1/verify/start').send({ phone: 'nope' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_PHONE');
  });

  it('POST /v1/verify/check', async () => {
    const app = createApp(env, verify);
    const res = await request(app)
      .post('/v1/verify/check')
      .send({ phone: '+14155552671', code: '123456' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('approved');
  });

  it('rate limits repeated starts', async () => {
    const tight: Env = { ...env, rateLimitStartPerPhone: 2 };
    const app = createApp(tight, verify);
    await request(app).post('/v1/verify/start').send({ phone: '+14155552671' });
    await request(app).post('/v1/verify/start').send({ phone: '+14155552671' });
    const res = await request(app)
      .post('/v1/verify/start')
      .send({ phone: '+14155552671' });
    expect(res.status).toBe(429);
    expect(res.body.error.code).toBe('RATE_LIMITED');
    expect(res.body.error.retryAfterMs).toBeGreaterThan(0);
  });
});

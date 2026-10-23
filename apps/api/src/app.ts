import express from 'express';
import cors from 'cors';
import type { Env } from './config/env';
import type { TwilioVerifyClient } from './services/twilioVerify';
import { createVerifyRouter } from './routes/verify';
import { createWebhooksRouter } from './routes/webhooks';
import { errorHandler } from './middleware/errorHandler';
import { ipRateLimiter } from './middleware/rateLimit';

export function createApp(env: Env, verify: TwilioVerifyClient) {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ limit: '32kb' }));
  app.use(ipRateLimiter());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'twilio-verify-api' });
  });

  app.use('/v1/verify', createVerifyRouter(env, verify));
  app.use('/v1/webhooks', createWebhooksRouter(env));

  app.use(errorHandler);
  return app;
}

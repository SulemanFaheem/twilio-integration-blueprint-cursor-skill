import { Router } from 'express';
import type { Env } from '../config/env';
import { twilioSignatureMiddleware } from '../middleware/twilioSignature';
import { logger } from '../utils/logger';

/** Optional Twilio status callbacks. Enable when you need delivery/status events. */
export function createWebhooksRouter(env: Env): Router {
  const router = Router();

  router.post('/twilio', twilioSignatureMiddleware(env), (req, res) => {
    const { To, Status, VerificationSid } = req.body as Record<string, string>;

    logger.info('[webhooks/twilio]', {
      phone: typeof To === 'string' ? `****${To.slice(-4)}` : undefined,
      status: Status,
      verificationSid: VerificationSid,
    });

    res.status(204).send();
  });

  return router;
}

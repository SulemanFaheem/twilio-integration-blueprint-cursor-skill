import type { Request, Response, NextFunction } from 'express';
import twilio from 'twilio';
import type { Env } from '../config/env';
import { logger } from '../utils/logger';

/** Validates `X-Twilio-Signature`. Skips when `PUBLIC_API_URL` is unset (local dev). */
export function twilioSignatureMiddleware(env: Env) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!env.publicApiUrl || !env.twilioAuthToken) {
      logger.warn('[webhooks] PUBLIC_API_URL unset; skipping signature validation');
      next();
      return;
    }

    const signature = req.header('X-Twilio-Signature') || '';
    const url = `${env.publicApiUrl.replace(/\/$/, '')}${req.originalUrl}`;
    const params = req.body as Record<string, string>;
    const valid = twilio.validateRequest(env.twilioAuthToken, signature, url, params);

    if (!valid) {
      res.status(403).json({
        ok: false,
        status: null,
        to: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid Twilio signature',
          retryAfterMs: 0,
        },
      });
      return;
    }

    next();
  };
}

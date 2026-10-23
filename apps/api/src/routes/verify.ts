import { Router } from 'express';
import type { Env } from '../config/env';
import type { TwilioVerifyClient } from '../services/twilioVerify';
import { normalizePhone } from '../utils/phone';
import { AppError, successResponse } from '../utils/errors';
import { createKeyedLimiter } from '../middleware/rateLimit';
import { asyncHandler } from '../middleware/asyncHandler';

export function createVerifyRouter(env: Env, verify: TwilioVerifyClient): Router {
  const router = Router();
  const limitStart = createKeyedLimiter(env.rateLimitStartPerPhone, env.rateLimitWindowMs);
  const limitCheck = createKeyedLimiter(env.rateLimitCheckPerPhone, env.rateLimitWindowMs);

  router.post(
    '/start',
    asyncHandler(async (req, res) => {
      const phone = normalizePhone(req.body?.phone, env.allowedCountryCodes);
      limitStart(`start:${phone}`);
      const status = await verify.start(phone);
      res.json(successResponse(status, phone));
    }),
  );

  router.post(
    '/check',
    asyncHandler(async (req, res) => {
      const phone = normalizePhone(req.body?.phone, env.allowedCountryCodes);
      const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';

      if (!code) {
        throw new AppError('VALIDATION_ERROR', 'code is required', 400, 0, phone);
      }

      limitCheck(`check:${phone}`);
      const status = await verify.check(phone, code);
      res.json(successResponse(status, phone));
    }),
  );

  return router;
}

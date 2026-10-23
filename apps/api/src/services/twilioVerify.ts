import twilio from 'twilio';
import type { VerifyStatus } from '@twilio-blueprint/shared';
import type { Env } from '../config/env';
import { AppError, mapTwilioError } from '../utils/errors';
import { phoneLast4 } from '../utils/phone';
import { logger } from '../utils/logger';

export interface TwilioVerifyClient {
  start(to: string): Promise<VerifyStatus>;
  check(to: string, code: string): Promise<VerifyStatus>;
}

export function createTwilioVerify(env: Env): TwilioVerifyClient {
  const client = twilio(env.twilioAccountSid, env.twilioAuthToken);
  const serviceSid = env.twilioVerifyServiceSid;

  return {
    async start(to: string): Promise<VerifyStatus> {
      try {
        const verification = await client.verify.v2
          .services(serviceSid)
          .verifications.create({ to, channel: 'sms' });

        logger.info('[verify] start', {
          phone: `****${phoneLast4(to)}`,
          status: verification.status,
        });

        return verification.status as VerifyStatus;
      } catch (err) {
        logger.error('[verify] start failed', { phone: `****${phoneLast4(to)}` });
        throw mapTwilioError(err, to);
      }
    },

    async check(to: string, code: string): Promise<VerifyStatus> {
      try {
        const result = await client.verify.v2
          .services(serviceSid)
          .verificationChecks.create({ to, code });

        logger.info('[verify] check', {
          phone: `****${phoneLast4(to)}`,
          status: result.status,
        });

        if (result.status !== 'approved') {
          throw new AppError(
            'INVALID_CODE',
            'The verification code is incorrect or expired.',
            400,
            0,
            to,
          );
        }

        return result.status as VerifyStatus;
      } catch (err) {
        if (err instanceof AppError) throw err;
        logger.error('[verify] check failed', { phone: `****${phoneLast4(to)}` });
        throw mapTwilioError(err, to);
      }
    },
  };
}

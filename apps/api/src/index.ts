import { loadEnv } from './config/env';
import { createTwilioVerify } from './services/twilioVerify';
import { createApp } from './app';
import { logger } from './utils/logger';

const env = loadEnv({ requireTwilio: true });
const app = createApp(env, createTwilioVerify(env));

app.listen(env.port, () => {
  logger.info(`[api] listening on http://localhost:${env.port}`);
});

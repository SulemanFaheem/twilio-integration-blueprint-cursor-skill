import type { Request, Response, NextFunction } from 'express';
import { AppError, errorResponse } from '../utils/errors';
import { logger } from '../utils/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err));
    return;
  }

  logger.error('[api] unhandled error', {
    message: err instanceof Error ? err.message : String(err),
  });

  res.status(500).json({
    ok: false,
    status: null,
    to: null,
    error: {
      code: 'TWILIO_ERROR',
      message: 'Internal server error',
      retryAfterMs: 0,
    },
  });
}

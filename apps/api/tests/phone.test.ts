import { describe, expect, it } from 'vitest';
import { normalizePhone } from '../src/utils/phone';
import { AppError } from '../src/utils/errors';

describe('normalizePhone', () => {
  it('normalizes valid US numbers to E.164', () => {
    // +1 415 555 2671 is a well-known valid libphonenumber example
    expect(normalizePhone('+1 (415) 555-2671', null)).toBe('+14155552671');
  });

  it('rejects invalid numbers', () => {
    expect(() => normalizePhone('123', null)).toThrow(AppError);
  });

  it('enforces allowlist', () => {
    expect(() => normalizePhone('+447911123456', ['US'])).toThrow(AppError);
  });
});

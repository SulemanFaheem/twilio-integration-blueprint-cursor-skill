import { describe, expect, it } from 'vitest';
import { ERROR_CODES, messageForErrorCode } from './index';

describe('messageForErrorCode', () => {
  it('returns copy for every known code', () => {
    for (const code of ERROR_CODES) {
      expect(messageForErrorCode(code).length).toBeGreaterThan(0);
    }
  });
});

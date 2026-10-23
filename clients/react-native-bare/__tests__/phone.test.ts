import { looksLikeE164, normalizeLocalInput } from '../src/utils/phone';
import { EXAMPLE_E164 } from '../src/types';

describe('phone utils', () => {
  it('accepts E.164', () => {
    expect(looksLikeE164(EXAMPLE_E164)).toBe(true);
  });

  it('rejects numbers without a leading +', () => {
    expect(looksLikeE164('14155552671')).toBe(false);
  });

  it('strips spaces and punctuation', () => {
    expect(normalizeLocalInput('+1 (415) 555-2671')).toBe('+14155552671');
  });
});

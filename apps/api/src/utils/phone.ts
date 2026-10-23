import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { AppError } from './errors';

export function normalizePhone(
  raw: unknown,
  allowedCountryCodes: string[] | null,
): string {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new AppError('VALIDATION_ERROR', 'phone is required', 400);
  }

  const parsed = parsePhoneNumberFromString(raw.trim());
  if (!parsed || !parsed.isValid()) {
    throw new AppError(
      'INVALID_PHONE',
      'Enter a valid phone number in E.164 format (e.g. +14155552671).',
      400,
    );
  }

  const e164 = parsed.format('E.164');

  if (allowedCountryCodes?.length) {
    const iso = parsed.country;
    if (!iso || !allowedCountryCodes.includes(iso)) {
      throw new AppError(
        'INVALID_PHONE',
        'This country code is not supported.',
        400,
        0,
        e164,
      );
    }
  }

  return e164;
}

/** Log-safe fragment: last 4 digits only. */
export function phoneLast4(e164: string): string {
  return e164.slice(-4);
}

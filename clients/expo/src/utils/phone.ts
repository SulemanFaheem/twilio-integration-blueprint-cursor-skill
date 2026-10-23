const E164 = /^\+[1-9]\d{6,14}$/;

export function looksLikeE164(phone: string): boolean {
  return E164.test(phone.trim());
}

export function normalizeLocalInput(phone: string): string {
  return phone.trim().replace(/[\s()-]/g, '');
}

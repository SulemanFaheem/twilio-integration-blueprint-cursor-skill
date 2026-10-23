import { useCallback, useEffect, useRef, useState } from 'react';
import { checkVerification, startVerification } from '../api/verifyClient';
import { EXAMPLE_E164, errorMessageFromResponse } from '../types';
import { looksLikeE164, normalizeLocalInput } from '../utils/phone';

export type VerifyStep = 'phone' | 'otp' | 'done';

const RESEND_COOLDOWN_MS = 30_000;

export function useVerifyFlow() {
  const mounted = useRef(true);
  const [step, setStep] = useState<VerifyStep>('phone');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendAt, setResendAt] = useState(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const start = useCallback(async (rawPhone: string) => {
    setError(null);
    const normalized = normalizeLocalInput(rawPhone);

    if (!looksLikeE164(normalized)) {
      setError(`Use E.164 format, e.g. ${EXAMPLE_E164}`);
      return;
    }

    setLoading(true);
    try {
      const res = await startVerification(normalized);
      if (!mounted.current) return;

      if (!res.ok || !res.status) {
        setError(errorMessageFromResponse(res, 'TWILIO_ERROR'));
        if (res.error?.retryAfterMs) {
          setResendAt(Date.now() + res.error.retryAfterMs);
        }
        return;
      }

      setPhone(res.to || normalized);
      setStep('otp');
      setResendAt(Date.now() + RESEND_COOLDOWN_MS);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  const check = useCallback(
    async (code: string) => {
      setError(null);
      const trimmed = code.trim();

      if (!/^\d{4,10}$/.test(trimmed)) {
        setError('Enter the code from your SMS');
        return;
      }

      setLoading(true);
      try {
        const res = await checkVerification(phone, trimmed);
        if (!mounted.current) return;

        if (!res.ok || res.status !== 'approved') {
          setError(errorMessageFromResponse(res, 'INVALID_CODE'));
          return;
        }

        setStep('done');
      } finally {
        if (mounted.current) setLoading(false);
      }
    },
    [phone],
  );

  const resend = useCallback(async () => {
    if (Date.now() < resendAt) return;
    await start(phone);
  }, [phone, resendAt, start]);

  const reset = useCallback(() => {
    setStep('phone');
    setPhone('');
    setError(null);
    setResendAt(0);
  }, []);

  return { step, phone, loading, error, resendAt, start, check, resend, reset };
}

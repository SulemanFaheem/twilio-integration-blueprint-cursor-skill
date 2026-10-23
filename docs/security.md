# Security

## Secrets

- Store Twilio credentials only on the server (`apps/api/.env`).
- Never ship Auth Token or Verify Service SID in mobile binaries.
- Keep `.env` out of git (see root `.gitignore`); commit only `.env.example`.

## Phone numbers (PII)

- Log last-4 digits only (`phoneLast4`).
- Do not log OTP codes.
- Prefer short retention if you persist verification events.

## Webhooks

- Set `PUBLIC_API_URL` and validate `X-Twilio-Signature` via `twilioSignature` middleware.
- Reject requests with invalid signatures (`403`).

## Rate limits

- Per-IP and per-phone limits reduce SMS abuse and cost spikes.
- Clients should honor `error.retryAfterMs` on `RATE_LIMITED` (429).

## Transport

- Production: HTTPS only between clients and API.
- Validate E.164 on the server even if the client pre-checks.

## After `approved`

This blueprint stops at verification success. Issue your own session/JWT, mark the user verified, and bind the phone to an account in your auth layer.

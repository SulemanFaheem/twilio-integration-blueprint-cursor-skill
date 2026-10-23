# API — Twilio Verify (Express + TypeScript)

Production-shaped Express service for SMS OTP via Twilio Verify.

## Layout

```
src/
  config/env.ts           # Env loading (fail-fast)
  services/twilioVerify.ts
  routes/verify.ts        # POST /start, /check
  routes/webhooks.ts      # Optional status callbacks
  middleware/             # rate limit, errors, signature, asyncHandler
  utils/                  # phone, errors, logger
```

## Setup

```bash
cp .env.example .env
# TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID

# from repo root
npm install
npm run dev:api
```

## Endpoints

| Method | Path | Body |
|--------|------|------|
| `GET` | `/health` | — |
| `POST` | `/v1/verify/start` | `{ "phone": "+14155552671" }` |
| `POST` | `/v1/verify/check` | `{ "phone": "+14155552671", "code": "123456" }` |
| `POST` | `/v1/webhooks/twilio` | Twilio form body (optional) |

Full contract: [`docs/api-contract.md`](../../docs/api-contract.md)

## Tests

```bash
npm run test:api
```

Twilio is mocked — no live credentials required in CI.

## Copy into an existing Express app

Prefer the pieces under `src/services`, `src/routes`, `src/middleware`, and `src/utils`, then mount the verify router at your preferred prefix. Or use [`skills/integrate-twilio`](../../skills/integrate-twilio).

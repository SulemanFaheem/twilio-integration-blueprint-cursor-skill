# Twilio Integration Blueprint — Implementation Plan

## Goal

Ship a reusable monorepo that demonstrates end-to-end phone OTP verification with **Twilio Verify**, including:

- Express + TypeScript backend (Verify API, webhooks, validation, rate limits, errors)
- React Native OTP screens + API client
- Env templates, tests, and deployment docs
- Cursor skill `/integrate-twilio` that adapts this pattern into an existing backend + mobile app

---

## Proposed repository structure

```
twilio-integration-blueprint/
├── PLAN.md                          # this file
├── README.md                        # overview, quick start, architecture
├── package.json                     # workspace root (optional npm/pnpm workspaces)
├── .gitignore
├── .env.example                     # root pointers / shared notes
├── docs/
│   ├── architecture.md
│   ├── deployment.md                # Railway / Render / Fly / Vercel (API) + Expo
│   └── security.md                  # secrets, webhook validation, PII
├── packages/
│   └── shared/                      # optional: phone utils, error codes, API types
│       └── src/
├── apps/
│   ├── api/                         # Express + TypeScript
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── config/env.ts
│   │   │   ├── routes/verify.ts
│   │   │   ├── routes/webhooks.ts
│   │   │   ├── services/twilioVerify.ts
│   │   │   ├── middleware/
│   │   │   │   ├── rateLimit.ts
│   │   │   │   ├── validatePhone.ts
│   │   │   │   ├── errorHandler.ts
│   │   │   │   └── twilioSignature.ts
│   │   │   └── utils/errors.ts
│   │   └── tests/
│   └── mobile/                      # React Native (Expo recommended)
│       ├── package.json
│       ├── app.json
│       ├── .env.example
│       ├── src/
│       │   ├── api/verifyClient.ts
│       │   ├── screens/
│       │   │   ├── PhoneEntryScreen.tsx
│       │   │   └── OtpVerifyScreen.tsx
│       │   ├── components/OtpInput.tsx
│       │   ├── hooks/useVerifyFlow.ts
│       │   └── utils/phone.ts
│       └── __tests__/
└── skills/
    └── integrate-twilio/
        └── SKILL.md                 # Cursor skill: adapt into existing apps
```

---

## Phase 0 — Foundations (day 0)

| Step | Deliverable |
|------|-------------|
| 0.1 | Root `README.md`, `.gitignore`, workspace layout |
| 0.2 | `apps/api` and `apps/mobile` scaffolding |
| 0.3 | Env templates (`.env.example`) for Twilio Account SID, Auth Token, Verify Service SID, API base URL, port |
| 0.4 | Document required Twilio Console setup (Verify Service, webhook URL) |

**Exit criteria:** Both apps install and start (API healthcheck; mobile Expo/RN boots with placeholder screens).

---

## Phase 1 — Backend: Twilio Verify core

### 1.1 Config & client

- Load env with validation (fail fast if SID/token/service missing)
- Thin `twilioVerify` service wrapping:
  - `verifications.create({ to, channel: 'sms' })`
  - `verificationChecks.create({ to, code })`

### 1.2 HTTP API

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/verify/start` | Start OTP (`phone` E.164) |
| `POST` | `/v1/verify/check` | Check OTP (`phone`, `code`) |
| `GET` | `/health` | Liveness |
| `POST` | `/v1/webhooks/twilio` | Optional status callbacks |

**Response shape (stable for mobile + skill):**

```json
{
  "ok": true,
  "status": "pending" | "approved" | "canceled",
  "to": "+1…",
  "error": null
}
```

Error envelope:

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_PHONE" | "RATE_LIMITED" | "TWILIO_ERROR" | "INVALID_CODE" | "VALIDATION_ERROR",
    "message": "human-readable",
    "retryAfterMs": 0
  }
}
```

### 1.3 Phone validation

- Normalize to E.164 (`libphonenumber-js` or equivalent)
- Reject invalid / too-short / missing country code
- Optional allowlist of country calling codes via env

### 1.4 Rate limits

- Per-IP and per-phone sliding windows (e.g. in-memory for blueprint; document Redis for production)
- Suggested defaults: 5 starts / phone / 15 min; 10 checks / phone / 15 min; global IP cap
- Return `429` + `retryAfterMs`

### 1.5 Error handling

- Map Twilio REST errors to stable `error.code` values
- Never leak Auth Token or raw Twilio payloads to clients
- Structured logging (request id, phone last-4 only)

### 1.6 Webhooks

- Validate `X-Twilio-Signature` when webhook path is enabled
- Idempotent handler for verification status updates
- Document when webhooks are optional vs required

**Exit criteria:** Curl/Postman can start + check Verify against a test number; invalid phone and rate limit paths covered.

---

## Phase 2 — Mobile: OTP UX + API integration

### 2.1 Screens

1. **PhoneEntryScreen** — country picker or fixed default, E.164 preview, Send code CTA, inline validation
2. **OtpVerifyScreen** — OTP length (6), auto-advance, resend with cooldown, error states

### 2.2 Client

- `verifyClient.start(phone)` / `verifyClient.check(phone, code)`
- Shared timeout, abort, and error-code mapping to UI copy
- Resend cooldown synced with server `retryAfterMs` when present

### 2.3 UX / safety

- Disable double-submit while in flight
- Mask phone in UI where sensible; never log full OTP
- Clear navigation: back to phone entry vs success callback prop/hook

**Exit criteria:** Against local API (or Twilio trial), full happy path + wrong-code + rate-limit messaging works on iOS/Android simulator.

---

## Phase 3 — Tests

### API

- Unit: phone normalize/validate, error mapper, rate limiter
- Integration: route tests with Twilio client mocked
- Signature middleware tests with known fixture vectors

### Mobile

- Component tests for OTP input behavior
- Hook/client tests with mocked fetch

### Tooling

- `vitest` or `jest` for API; Jest + RNTL for mobile
- `npm test` scripts at package and root level

**Exit criteria:** CI-friendly `npm test` green with mocks (no live Twilio required in CI).

---

## Phase 4 — Docs & deployment

### Docs

- Architecture diagram (mobile → API → Twilio Verify)
- Local setup: Twilio trial, Verify Service SID, env copy
- Security: secrets, signature validation, PII retention notes
- Production checklist: HTTPS only, Redis rate limits, monitoring

### Deployment instructions

- API: one path documented end-to-end (e.g. Render or Railway) + webhook URL registration
- Mobile: Expo env (`EXPO_PUBLIC_API_URL`), build notes
- Troubleshooting: common Twilio error codes, trial number restrictions

**Exit criteria:** A new developer can go from clone → verified OTP using only the docs.

---

## Phase 5 — Cursor skill `/integrate-twilio`

Location: `skills/integrate-twilio/SKILL.md` (and install guidance for `~/.cursor/skills/`).

### Skill responsibilities

When invoked against an **existing** codebase, the skill should:

1. Detect backend stack (Express/Fastify/Nest/etc.) and mobile stack (RN/Expo)
2. Port Verify service + routes + middleware into the host API conventions
3. Wire OTP screens/hooks into existing navigation and design system
4. Add/merge env vars without overwriting secrets
5. Preserve host error formats **or** introduce an adapter layer
6. Call out webhook + rate-limit production hardening

### Skill inputs (ask if missing)

- Path to API and mobile app roots
- Preferred route prefix
- Auth session strategy after `approved` (JWT issue, mark user verified, etc.)

### Skill outputs

- Patched files + short integration checklist
- Test stubs matching host test runner

**Exit criteria:** Skill doc is actionable; blueprint README links to it as the “bring into my app” path.

---

## Implementation order (execution checklist)

1. [ ] Root repo hygiene + README skeleton  
2. [ ] `apps/api` Express+TS bootstrap + health  
3. [ ] Twilio Verify service + start/check routes  
4. [ ] Phone validation + rate limits + error handler  
5. [ ] Webhook route + signature validation  
6. [ ] API unit/integration tests + `.env.example`  
7. [ ] `apps/mobile` Expo/RN screens + client  
8. [ ] Mobile tests  
9. [ ] Docs: architecture, security, deployment  
10. [ ] `skills/integrate-twilio/SKILL.md`  
11. [ ] End-to-end smoke pass + final README polish  

---

## Tech choices (defaults)

| Area | Choice | Rationale |
|------|--------|-----------|
| API runtime | Node 20+, Express, TypeScript | Matches brief; widely portable |
| Phone parse | `libphonenumber-js` | Solid E.164 validation |
| Rate limit | `express-rate-limit` + custom per-phone store | Simple blueprint; swap to Redis later |
| Twilio SDK | Official `twilio` package | Supported Verify APIs |
| Mobile | Expo (React Native) | Fastest OTP UI demo |
| Tests | Vitest (API), Jest (mobile) | Fast, common |
| Package manager | npm workspaces | Zero extra tooling |

Open to swap if you prefer pnpm, Nest, or bare RN CLI.

---

## Out of scope (unless requested)

- Full user/auth product (passwords, social login)
- Voice/WhatsApp channels (SMS-first; structure allows later)
- Production Redis/KMS wiring beyond documentation
- Multi-tenant Twilio subaccounts

---

## Success metrics

- Happy-path OTP works with Twilio trial credentials  
- Invalid phone / wrong code / rate limit return stable error codes  
- Tests pass without live Twilio in CI  
- Docs + skill enable reuse in another app without rewriting Verify from scratch  

---

## Next step

Approve this plan (or note preference changes), then implement **Phase 0 → Phase 1** first.

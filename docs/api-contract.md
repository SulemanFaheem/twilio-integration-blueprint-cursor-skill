# API contract

All clients (`clients/expo`, `clients/react-native-bare`, `clients/flutter`) use this contract.

Base URL example: `http://localhost:3000`

## Endpoints

### `GET /health`

```json
{ "ok": true, "service": "twilio-verify-api" }
```

### `POST /v1/verify/start`

Start an SMS OTP via Twilio Verify.

**Request**

```json
{ "phone": "+14155552671" }
```

`phone` must be E.164 (`+` and country code).

**Success `200`**

```json
{
  "ok": true,
  "status": "pending",
  "to": "+14155552671",
  "error": null
}
```

### `POST /v1/verify/check`

**Request**

```json
{
  "phone": "+14155552671",
  "code": "123456"
}
```

**Success `200` (approved)**

```json
{
  "ok": true,
  "status": "approved",
  "to": "+14155552671",
  "error": null
}
```

**Wrong code `400`**

```json
{
  "ok": false,
  "status": null,
  "to": "+14155552671",
  "error": {
    "code": "INVALID_CODE",
    "message": "The verification code is incorrect or expired.",
    "retryAfterMs": 0
  }
}
```

### `POST /v1/webhooks/twilio`

Optional Twilio status callback. Validates `X-Twilio-Signature`. Returns `204` on success.

## Error envelope

```json
{
  "ok": false,
  "status": null,
  "to": null,
  "error": {
    "code": "INVALID_PHONE",
    "message": "human-readable",
    "retryAfterMs": 0
  }
}
```

| `error.code` | HTTP | Meaning |
|--------------|------|---------|
| `VALIDATION_ERROR` | 400 | Missing/malformed body |
| `INVALID_PHONE` | 400 | Not valid E.164 / blocked country |
| `INVALID_CODE` | 400 | Check failed |
| `RATE_LIMITED` | 429 | Too many requests; use `retryAfterMs` |
| `TWILIO_ERROR` | 502 | Upstream Twilio failure |

## Status values

`pending` | `approved` | `canceled` | `null` (on error)

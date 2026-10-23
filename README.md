# Twilio Integration Blueprint

Clean, copy-paste reference for **Twilio Verify** phone OTP. One Express API, three self-contained mobile clients. Pick your stack, copy the files, point at the API.

## Pick your folder

| You are building… | Go here |
|-------------------|--------|
| Backend (Express + TypeScript) | [`apps/api`](apps/api) |
| Expo | [`clients/expo`](clients/expo) |
| React Native bare (CLI) | [`clients/react-native-bare`](clients/react-native-bare) |
| Flutter | [`clients/flutter`](clients/flutter) |
| Shared TS types (API) | [`packages/shared`](packages/shared) |
| HTTP contract | [`docs/api-contract.md`](docs/api-contract.md) |
| Cursor skill (`/integrate-twilio`) | [`.cursor/skills/integrate-twilio`](.cursor/skills/integrate-twilio) |

## Quick start (API)

```bash
cp apps/api/.env.example apps/api/.env
# Fill TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID

npm install
npm run dev:api
```

Health: `GET http://localhost:3000/health`

## Quick start (any client)

1. Run the API.
2. Open the client folder README and copy the listed files.
3. Set the API base URL for that stack.
4. Use a real E.164 number (example in docs: `+14155552671`).

All clients call:

- `POST /v1/verify/start` — `{ "phone": "+14155552671" }`
- `POST /v1/verify/check` — `{ "phone": "+14155552671", "code": "123456" }`

## Docs

- [API contract](docs/api-contract.md)
- [Architecture](docs/architecture.md)
- [Deployment](docs/deployment.md)
- [Security](docs/security.md)

## Twilio Console

1. Create a **Verify** service → copy Service SID (`VA…`).
2. Use Account SID + Auth Token from the dashboard.
3. Optional webhook: `https://<your-api>/v1/webhooks/twilio`.

Trial accounts can only SMS verified numbers until you upgrade.

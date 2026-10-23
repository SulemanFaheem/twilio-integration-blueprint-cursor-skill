# Deployment

## API (`apps/api`)

1. Set env vars (never commit secrets):

   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID`
   - `PORT` (platform often sets this)
   - `PUBLIC_API_URL` — public HTTPS origin for webhook signature checks
   - Optional: `ALLOWED_COUNTRY_CODES`, rate-limit overrides

2. Build and start:

   ```bash
   npm install
   npm run build:api
   npm start --workspace=@twilio-blueprint/api
   ```

3. Deploy to any Node host (Render, Railway, Fly.io, etc.):

   - Start command: `node apps/api/dist/index.js` (or workspace start)
   - Health check: `GET /health`

4. In Twilio Verify Console, set status callback (optional) to:

   `https://<your-host>/v1/webhooks/twilio`

### Production notes

- Terminate TLS at the edge; Twilio requires HTTPS for webhooks.
- Replace in-memory per-phone rate limits with Redis for multi-instance deploys.
- Restrict CORS if you serve a known web origin.

## Mobile clients

Point each client at the deployed API:

| Client | Config |
|--------|--------|
| Expo | `EXPO_PUBLIC_API_URL=https://api.example.com` |
| RN bare | `API_BASE_URL=https://api.example.com` |
| Flutter | `--dart-define=API_BASE_URL=https://api.example.com` |

Use your machine LAN IP or platform loopback aliases when testing against a local API from a device/emulator (`10.0.2.2` on Android emulator).

## Twilio trial

Trial accounts only SMS verified numbers. Upgrade the account for production traffic.

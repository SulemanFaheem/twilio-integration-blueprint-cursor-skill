# Expo — Twilio Verify OTP

Self-contained TypeScript sources you can paste into an Expo app.

## Copy these files

| File | Role |
|------|------|
| `src/api/verifyClient.ts` | `start` / `check` HTTP calls |
| `src/hooks/useVerifyFlow.ts` | Phone → OTP → done state |
| `src/screens/PhoneEntryScreen.tsx` | Phone UI |
| `src/screens/OtpVerifyScreen.tsx` | OTP UI |
| `src/components/OtpInput.tsx` | Digit inputs |
| `src/utils/phone.ts` | Light E.164 helpers |
| `src/types.ts` | Response envelope + error copy |
| `src/theme.ts` | Colors (swap for your design system) |

Wire them like [`App.tsx`](App.tsx).

## Configure

```bash
cp .env.example .env
# EXPO_PUBLIC_API_URL=http://localhost:3000
# Use your LAN IP when testing on a physical device
```

## Integrate

```bash
npx create-expo-app my-app --template blank-typescript
# copy src/ into the new app, adapt App.tsx, run apps/api, then:
npx expo start
```

Contract: [`docs/api-contract.md`](../../docs/api-contract.md)

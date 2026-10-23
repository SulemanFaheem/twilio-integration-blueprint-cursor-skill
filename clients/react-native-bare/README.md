# React Native (bare) — Twilio Verify OTP

JS/TS sources to paste into an existing React Native CLI app. No `android/` / `ios/` trees — keep your native project; copy `src/`.

## Copy these files

| File | Role |
|------|------|
| `src/config.ts` | `API_BASE_URL` |
| `src/api/verifyClient.ts` | `start` / `check` HTTP calls |
| `src/hooks/useVerifyFlow.ts` | Phone → OTP → done state |
| `src/screens/PhoneEntryScreen.tsx` | Phone UI |
| `src/screens/OtpVerifyScreen.tsx` | OTP UI |
| `src/components/OtpInput.tsx` | Digit inputs |
| `src/utils/phone.ts` | Light E.164 helpers |
| `src/types.ts` | Response envelope + error copy |
| `src/theme.ts` | Colors (swap for your design system) |

Wire them like [`App.tsx`](App.tsx), or drop the screens into React Navigation.

## Configure

```bash
cp .env.example .env
# API_BASE_URL=http://localhost:3000
# Android emulator → host: http://10.0.2.2:3000
```

Optional: load via [`react-native-config`](https://github.com/luggit/react-native-config) instead of the constant in `src/config.ts`.

## Diff vs Expo

Same screens and flow. Expo uses `EXPO_PUBLIC_API_URL`; bare uses `API_BASE_URL` / `src/config.ts`.

Contract: [`docs/api-contract.md`](../../docs/api-contract.md)

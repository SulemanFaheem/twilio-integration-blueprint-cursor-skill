# Flutter — Twilio Verify OTP

Self-contained Dart sources you can paste into a Flutter app.

## Copy these files

| File | Role |
|------|------|
| `lib/services/verify_api.dart` | `start` / `check` HTTP calls |
| `lib/models/verify_response.dart` | JSON models + error copy |
| `lib/screens/phone_entry_screen.dart` | Phone UI |
| `lib/screens/otp_verify_screen.dart` | OTP UI |
| `lib/utils/phone.dart` | Light E.164 helpers |
| `lib/theme.dart` | Colors (swap for your design system) |
| `lib/verify_flow.dart` | Optional phone → OTP → done shell |

Add to your `pubspec.yaml`:

```yaml
dependencies:
  http: ^1.2.2
```

## Configure & run

```bash
flutter run --dart-define=API_BASE_URL=http://localhost:3000
# Android emulator → host: http://10.0.2.2:3000
```

## Tests

```bash
flutter test
```

Contract: [`docs/api-contract.md`](../../docs/api-contract.md)

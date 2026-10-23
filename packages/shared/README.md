# `@twilio-blueprint/shared`

TypeScript types and error-code helpers shared by `apps/api`, `clients/expo`, and `clients/react-native-bare`.

Flutter mirrors the same JSON in `clients/flutter/lib/models/verify_response.dart`.

```ts
import type { VerifyResponse } from '@twilio-blueprint/shared';
import { messageForErrorCode } from '@twilio-blueprint/shared';
```

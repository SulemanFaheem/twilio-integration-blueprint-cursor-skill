import 'package:flutter_test/flutter_test.dart';
import 'package:twilio_verify_flutter/models/verify_response.dart';
import 'package:twilio_verify_flutter/theme.dart';
import 'package:twilio_verify_flutter/utils/phone.dart';

void main() {
  test('looksLikeE164', () {
    expect(looksLikeE164(exampleE164), isTrue);
    expect(looksLikeE164('14155552671'), isFalse);
  });

  test('normalizeLocalInput', () {
    expect(normalizeLocalInput('+1 (415) 555-2671'), '+14155552671');
  });

  test('VerifyResponse.fromJson', () {
    final res = VerifyResponse.fromJson({
      'ok': true,
      'status': 'pending',
      'to': exampleE164,
      'error': null,
    });
    expect(res.ok, isTrue);
    expect(res.status, 'pending');
  });
}

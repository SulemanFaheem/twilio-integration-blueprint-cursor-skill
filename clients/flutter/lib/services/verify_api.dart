import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/verify_response.dart';

/// HTTP client for the blueprint Verify API.
///
/// ```sh
/// flutter run --dart-define=API_BASE_URL=http://localhost:3000
/// ```
class VerifyApi {
  VerifyApi({String? baseUrl, http.Client? client})
      : baseUrl = _normalizeBase(
          baseUrl ??
              const String.fromEnvironment(
                'API_BASE_URL',
                defaultValue: 'http://localhost:3000',
              ),
        ),
        _client = client ?? http.Client();

  final String baseUrl;
  final http.Client _client;

  static String _normalizeBase(String value) =>
      value.replaceAll(RegExp(r'/$'), '');

  Future<VerifyResponse> start(String phone) =>
      _post('/v1/verify/start', {'phone': phone});

  Future<VerifyResponse> check(String phone, String code) =>
      _post('/v1/verify/check', {'phone': phone, 'code': code});

  Future<VerifyResponse> _post(String path, Map<String, dynamic> body) async {
    final res = await _client.post(
      Uri.parse('$baseUrl$path'),
      headers: const {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode(body),
    );

    try {
      final json = jsonDecode(res.body);
      if (json is Map<String, dynamic>) {
        return VerifyResponse.fromJson(json);
      }
    } catch (_) {
      // fall through
    }

    return VerifyResponse(
      ok: false,
      error: ApiErrorBody(
        code: 'TWILIO_ERROR',
        message: 'Unexpected response (${res.statusCode})',
        retryAfterMs: 0,
      ),
    );
  }
}

/// Mirrors docs/api-contract.md

class ApiErrorBody {
  const ApiErrorBody({
    required this.code,
    required this.message,
    required this.retryAfterMs,
  });

  final String code;
  final String message;
  final int retryAfterMs;

  factory ApiErrorBody.fromJson(Map<String, dynamic> json) {
    return ApiErrorBody(
      code: json['code'] as String? ?? 'TWILIO_ERROR',
      message: json['message'] as String? ?? 'Unknown error',
      retryAfterMs: (json['retryAfterMs'] as num?)?.toInt() ?? 0,
    );
  }
}

class VerifyResponse {
  const VerifyResponse({
    required this.ok,
    this.status,
    this.to,
    this.error,
  });

  final bool ok;
  final String? status;
  final String? to;
  final ApiErrorBody? error;

  factory VerifyResponse.fromJson(Map<String, dynamic> json) {
    final rawError = json['error'];
    return VerifyResponse(
      ok: json['ok'] as bool? ?? false,
      status: json['status'] as String?,
      to: json['to'] as String?,
      error: rawError is Map<String, dynamic>
          ? ApiErrorBody.fromJson(rawError)
          : null,
    );
  }

  String message({required String fallbackCode}) {
    if (error?.message != null && error!.message.isNotEmpty) {
      return error!.message;
    }
    return messageForErrorCode(error?.code ?? fallbackCode);
  }
}

String messageForErrorCode(String code) {
  const messages = {
    'INVALID_PHONE': 'Enter a valid phone number with country code.',
    'RATE_LIMITED': 'Too many attempts. Please wait and try again.',
    'INVALID_CODE': 'That code is incorrect or expired.',
    'VALIDATION_ERROR': 'Check your input and try again.',
    'TWILIO_ERROR': 'Verification service is temporarily unavailable.',
  };
  return messages[code] ?? 'Something went wrong.';
}

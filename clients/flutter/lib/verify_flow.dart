import 'package:flutter/material.dart';

import 'screens/otp_verify_screen.dart';
import 'screens/phone_entry_screen.dart';
import 'services/verify_api.dart';
import 'theme.dart';

enum VerifyStep { phone, otp, done }

/// Wires phone → OTP → done. Drop into a route or use as `home`.
class VerifyFlow extends StatefulWidget {
  const VerifyFlow({super.key, this.api});

  final VerifyApi? api;

  @override
  State<VerifyFlow> createState() => _VerifyFlowState();
}

class _VerifyFlowState extends State<VerifyFlow> {
  late final VerifyApi _api = widget.api ?? VerifyApi();

  VerifyStep _step = VerifyStep.phone;
  String _phone = '';
  bool _loading = false;
  String? _error;
  DateTime _resendAt = DateTime.fromMillisecondsSinceEpoch(0);

  void _safeSet(VoidCallback fn) {
    if (!mounted) return;
    setState(fn);
  }

  Future<void> _start(String phone) async {
    _safeSet(() {
      _loading = true;
      _error = null;
    });

    try {
      final res = await _api.start(phone);
      if (!mounted) return;

      if (!res.ok) {
        _safeSet(() {
          _error = res.message(fallbackCode: 'TWILIO_ERROR');
          final retry = res.error?.retryAfterMs ?? 0;
          if (retry > 0) {
            _resendAt = DateTime.now().add(Duration(milliseconds: retry));
          }
        });
        return;
      }

      _safeSet(() {
        _phone = res.to ?? phone;
        _step = VerifyStep.otp;
        _resendAt = DateTime.now().add(const Duration(seconds: 30));
      });
    } finally {
      _safeSet(() => _loading = false);
    }
  }

  Future<void> _check(String code) async {
    _safeSet(() {
      _loading = true;
      _error = null;
    });

    try {
      final res = await _api.check(_phone, code);
      if (!mounted) return;

      if (!res.ok || res.status != 'approved') {
        _safeSet(() {
          _error = res.message(fallbackCode: 'INVALID_CODE');
        });
        return;
      }

      _safeSet(() => _step = VerifyStep.done);
    } finally {
      _safeSet(() => _loading = false);
    }
  }

  Future<void> _resend() async {
    if (DateTime.now().isBefore(_resendAt)) return;
    await _start(_phone);
  }

  void _reset() {
    _safeSet(() {
      _step = VerifyStep.phone;
      _phone = '';
      _error = null;
      _resendAt = DateTime.fromMillisecondsSinceEpoch(0);
    });
  }

  @override
  Widget build(BuildContext context) {
    switch (_step) {
      case VerifyStep.phone:
        return PhoneEntryScreen(
          loading: _loading,
          error: _error,
          onSubmit: _start,
        );
      case VerifyStep.otp:
        return OtpVerifyScreen(
          phone: _phone,
          loading: _loading,
          error: _error,
          resendAt: _resendAt,
          onVerify: _check,
          onResend: _resend,
          onBack: _reset,
        );
      case VerifyStep.done:
        return Scaffold(
          backgroundColor: AppColors.background,
          body: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 48),
                  const Text(
                    'Verified',
                    style: TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '$_phone is confirmed.',
                    style: const TextStyle(color: AppColors.muted, fontSize: 16),
                  ),
                  TextButton(
                    onPressed: _reset,
                    child: const Text('Start over'),
                  ),
                ],
              ),
            ),
          ),
        );
    }
  }
}

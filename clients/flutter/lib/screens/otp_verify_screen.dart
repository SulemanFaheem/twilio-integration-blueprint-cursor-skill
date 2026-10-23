import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme.dart';

class OtpVerifyScreen extends StatefulWidget {
  const OtpVerifyScreen({
    super.key,
    required this.phone,
    required this.loading,
    this.error,
    required this.resendAt,
    required this.onVerify,
    required this.onResend,
    required this.onBack,
  });

  final String phone;
  final bool loading;
  final String? error;
  final DateTime resendAt;
  final Future<void> Function(String code) onVerify;
  final Future<void> Function() onResend;
  final VoidCallback onBack;

  @override
  State<OtpVerifyScreen> createState() => _OtpVerifyScreenState();
}

class _OtpVerifyScreenState extends State<OtpVerifyScreen> {
  final _controller = TextEditingController();
  Timer? _ticker;
  DateTime _now = DateTime.now();

  @override
  void initState() {
    super.initState();
    _ticker = Timer.periodic(const Duration(milliseconds: 500), (_) {
      if (mounted) setState(() => _now = DateTime.now());
    });
  }

  @override
  void dispose() {
    _ticker?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final waitMs = widget.resendAt.difference(_now).inMilliseconds;
    final canResend = waitMs <= 0 && !widget.loading;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 48),
              const Text(
                'Enter the code',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  color: AppColors.text,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Sent to ${widget.phone}',
                style: const TextStyle(color: AppColors.muted),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _controller,
                keyboardType: TextInputType.number,
                maxLength: 6,
                enabled: !widget.loading,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                onChanged: (_) => setState(() {}),
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  counterText: '',
                  hintText: '6-digit code',
                  filled: true,
                  fillColor: AppColors.surface,
                ),
              ),
              if (widget.error != null) ...[
                const SizedBox(height: 12),
                Text(widget.error!, style: const TextStyle(color: AppColors.danger)),
              ],
              const SizedBox(height: 16),
              FilledButton(
                onPressed: widget.loading || _controller.text.length < 4
                    ? null
                    : () => widget.onVerify(_controller.text),
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: widget.loading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Text('Verify'),
              ),
              TextButton(
                onPressed: canResend ? () => widget.onResend() : null,
                child: Text(
                  canResend
                      ? 'Resend code'
                      : 'Resend in ${(waitMs / 1000).ceil()}s',
                ),
              ),
              TextButton(
                onPressed: widget.onBack,
                child: const Text('Change number'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

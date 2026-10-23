import 'package:flutter/material.dart';

import '../theme.dart';
import '../utils/phone.dart';

class PhoneEntryScreen extends StatefulWidget {
  const PhoneEntryScreen({
    super.key,
    required this.loading,
    this.error,
    required this.onSubmit,
  });

  final bool loading;
  final String? error;
  final Future<void> Function(String phone) onSubmit;

  @override
  State<PhoneEntryScreen> createState() => _PhoneEntryScreenState();
}

class _PhoneEntryScreenState extends State<PhoneEntryScreen> {
  final _controller = TextEditingController(text: '+1');

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final phone = normalizeLocalInput(_controller.text);
    if (!looksLikeE164(phone)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Use E.164 format, e.g. $exampleE164')),
      );
      return;
    }
    await widget.onSubmit(phone);
  }

  @override
  Widget build(BuildContext context) {
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
                'Verify your phone',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  color: AppColors.text,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Include country code (E.164), e.g. $exampleE164',
                style: const TextStyle(color: AppColors.muted),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _controller,
                keyboardType: TextInputType.phone,
                enabled: !widget.loading,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: exampleE164,
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
                onPressed: widget.loading ? null : _submit,
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
                    : const Text('Send code'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

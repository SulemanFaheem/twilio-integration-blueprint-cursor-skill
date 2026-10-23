import 'package:flutter/material.dart';

import 'theme.dart';
import 'verify_flow.dart';

void main() {
  runApp(const TwilioVerifyApp());
}

class TwilioVerifyApp extends StatelessWidget {
  const TwilioVerifyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Twilio Verify',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary),
        useMaterial3: true,
      ),
      home: const VerifyFlow(),
    );
  }
}

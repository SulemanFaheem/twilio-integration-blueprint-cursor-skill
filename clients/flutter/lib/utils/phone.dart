final _e164 = RegExp(r'^\+[1-9]\d{6,14}$');

bool looksLikeE164(String phone) => _e164.hasMatch(phone.trim());

String normalizeLocalInput(String phone) =>
    phone.trim().replaceAll(RegExp(r'[\s()-]'), '');

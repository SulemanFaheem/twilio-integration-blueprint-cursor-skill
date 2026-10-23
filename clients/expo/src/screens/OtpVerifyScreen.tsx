import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { OtpInput } from '../components/OtpInput';
import { colors } from '../theme';

type Props = {
  phone: string;
  loading: boolean;
  error: string | null;
  resendAt: number;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
};

export function OtpVerifyScreen({
  phone,
  loading,
  error,
  resendAt,
  onVerify,
  onResend,
  onBack,
}: Props) {
  const [code, setCode] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const waitMs = Math.max(0, resendAt - now);
  const canResend = waitMs === 0 && !loading;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the code</Text>
      <Text style={styles.hint}>Sent to {phone}</Text>
      <OtpInput value={code} onChange={setCode} editable={!loading} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable
        style={[styles.button, (loading || code.length < 4) && styles.buttonDisabled]}
        disabled={loading || code.length < 4}
        onPress={() => onVerify(code)}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </Pressable>
      <Pressable disabled={!canResend} onPress={onResend} style={styles.link}>
        <Text style={[styles.linkText, !canResend && styles.linkMuted]}>
          {canResend ? 'Resend code' : `Resend in ${Math.ceil(waitMs / 1000)}s`}
        </Text>
      </Pressable>
      <Pressable onPress={onBack} style={styles.link}>
        <Text style={styles.linkText}>Change number</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text,
  },
  hint: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 20,
  },
  error: {
    color: colors.danger,
    marginTop: 12,
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: colors.primary,
    fontSize: 15,
  },
  linkMuted: {
    color: colors.disabled,
  },
});

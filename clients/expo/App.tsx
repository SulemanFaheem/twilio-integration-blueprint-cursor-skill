import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useVerifyFlow } from './src/hooks/useVerifyFlow';
import { PhoneEntryScreen } from './src/screens/PhoneEntryScreen';
import { OtpVerifyScreen } from './src/screens/OtpVerifyScreen';
import { colors } from './src/theme';

/** Sample shell — paste screens + `useVerifyFlow` into your navigator. */
export default function App() {
  const { step, phone, loading, error, resendAt, start, check, resend, reset } =
    useVerifyFlow();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {step === 'phone' && (
        <PhoneEntryScreen loading={loading} error={error} onSubmit={start} />
      )}

      {step === 'otp' && (
        <OtpVerifyScreen
          phone={phone}
          loading={loading}
          error={error}
          resendAt={resendAt}
          onVerify={check}
          onResend={resend}
          onBack={reset}
        />
      )}

      {step === 'done' && (
        <View style={styles.done}>
          <Text style={styles.doneTitle}>Verified</Text>
          <Text style={styles.doneHint}>{phone} is confirmed.</Text>
          <Pressable onPress={reset} style={styles.link} accessibilityRole="button">
            <Text style={styles.linkText}>Start over</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  done: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  doneTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  doneHint: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 16,
  },
  link: {
    marginTop: 24,
    alignSelf: 'flex-start',
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
  },
});

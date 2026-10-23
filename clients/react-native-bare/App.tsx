import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useVerifyFlow } from './src/hooks/useVerifyFlow';
import { PhoneEntryScreen } from './src/screens/PhoneEntryScreen';
import { OtpVerifyScreen } from './src/screens/OtpVerifyScreen';
import { colors } from './src/theme';

/** Sample shell — paste screens + `useVerifyFlow` into your navigator. */
export default function App() {
  const flow = useVerifyFlow();

  return (
    <SafeAreaView style={styles.safe}>
      {flow.step === 'phone' && (
        <PhoneEntryScreen loading={flow.loading} error={flow.error} onSubmit={flow.start} />
      )}
      {flow.step === 'otp' && (
        <OtpVerifyScreen
          phone={flow.phone}
          loading={flow.loading}
          error={flow.error}
          resendAt={flow.resendAt}
          onVerify={flow.check}
          onResend={flow.resend}
          onBack={flow.reset}
        />
      )}
      {flow.step === 'done' && (
        <View style={styles.done}>
          <Text style={styles.doneTitle}>Verified</Text>
          <Text style={styles.doneHint}>{flow.phone} is confirmed.</Text>
          <Pressable onPress={flow.reset} style={styles.link}>
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
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
  },
});

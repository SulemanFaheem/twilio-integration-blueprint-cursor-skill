import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  editable?: boolean;
};

export function OtpInput({ length = 6, value, onChange, editable = true }: Props) {
  const refs = useRef<Array<TextInput | null>>([]);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          style={[styles.box, index < length - 1 && styles.boxSpacing]}
          keyboardType="number-pad"
          maxLength={1}
          editable={editable}
          value={digit.trim()}
          onChangeText={(text) => {
            const next = value.split('');
            next[index] = text.replace(/\D/g, '').slice(-1);
            const joined = next.join('').slice(0, length);
            onChange(joined);
            if (text && index < length - 1) {
              refs.current[index + 1]?.focus();
            }
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !digit.trim() && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  box: {
    width: 44,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  boxSpacing: {
    marginRight: 8,
  },
});

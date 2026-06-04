import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
  type TextInputProps,
} from 'react-native';
import { colors } from '../styles/colors';

type Props = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  editable?: boolean;
  maxLength?: number;
  testID?: string;
  onBlur?: TextInputProps['onBlur'];
  onFocus?: TextInputProps['onFocus'];
  theme?: 'light' | 'dark';
};

export default function CustomInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = 'none',
  error,
  returnKeyType,
  onSubmitEditing,
  editable = true,
  maxLength,
  testID,
  onBlur,
  onFocus,
  theme = 'dark',
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [secureHidden, setSecureHidden] = useState(secureTextEntry);
  const hasError = !!error;
  const isLight = theme === 'light';

  // Dynamic values based on theme and input state
  const containerBgColor = isLight
    ? (isFocused || value ? '#e2f5fc' : '#f3f4f6')
    : colors.gray800;

  const containerBorderColor = hasError
    ? colors.error
    : isFocused
    ? (isLight ? '#01B4E4' : colors.primary)
    : isLight
    ? (value ? '#e2f5fc' : '#f3f4f6')
    : colors.border;

  const inputTextColor = isLight ? '#111827' : colors.white;
  const placeholderColor = isLight ? '#9ca3af' : colors.gray400;
  const labelTextColor = isLight ? '#4b5563' : colors.gray300;
  const containerBorderRadius = isLight ? 8 : 12;

  const iconColor = isLight ? '#7e8890' : colors.primary;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, { color: labelTextColor }]} accessibilityRole="text">
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: containerBgColor,
            borderColor: containerBorderColor,
            borderRadius: containerBorderRadius,
          },
        ]}
      >
        <TextInput
          testID={testID}
          style={[styles.input, { color: inputTextColor }]}
          value={value}
          onChangeText={onChangeText}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          secureTextEntry={secureHidden}
          keyboardType={keyboardType ?? 'default'}
          autoCapitalize={autoCapitalize}
          editable={editable}
          maxLength={maxLength}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setSecureHidden(!secureHidden)}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <View style={styles.eyeOuter}>
              <View style={[styles.eyeInner, { backgroundColor: iconColor }]} />
              {secureHidden && (
                <View style={[styles.eyeSlash, { backgroundColor: iconColor }]} />
              )}
            </View>
          </TouchableOpacity>
        ) : value ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText('')}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <View style={styles.clearCircle}>
              <Text style={styles.clearText}>✕</Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      {hasError ? (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      ) : (
        <View style={styles.errorSpace} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    height: '100%',
  },
  toggleButton: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  clearButton: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  clearCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#7e8890',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -1,
  },
  eyeOuter: {
    width: 20,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: '#7e8890',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  eyeInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  eyeSlash: {
    position: 'absolute',
    width: 1.8,
    height: 16,
    transform: [{ rotate: '45deg' }],
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },
  errorSpace: {
    height: 20,
  },
});

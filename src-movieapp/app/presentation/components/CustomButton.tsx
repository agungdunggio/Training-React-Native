import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../styles/colors';

type Variant = 'primary' | 'secondary';

type Props = {
  title: string;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: 'light' | 'dark';
};

export default function CustomButton({
  title,
  variant = 'primary',
  disabled = false,
  loading = false,
  onPress,
  style,
  testID,
  theme = 'dark',
}: Props) {
  const isLight = theme === 'light';
  const isPrimary = variant === 'primary';

  // Dynamic values
  const btnStyle = isLight
    ? (isPrimary ? styles.lightPrimary : styles.lightSecondary)
    : (isPrimary ? styles.primary : styles.secondary);

  const labelColor = isLight
    ? (isPrimary ? colors.white : colors.secondary)
    : colors.white;

  const dynamicBaseStyle = {
    borderRadius: isLight ? 8 : 12,
    // Remove shadow for clean TMDB flat design in light theme
    ...(isLight ? { shadowOpacity: 0, elevation: 0 } : {}),
  };

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.base,
        dynamicBaseStyle,
        btnStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <Text style={[styles.label, { color: labelColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  primary: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  lightPrimary: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  lightSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

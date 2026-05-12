import { yupResolver } from '@hookform/resolvers/yup';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import LoadingOverlay from '../components/LoadingOverlay';
import { getAxiosErrorMessage, loginRequest } from '../api/authApi';
import { saveSession } from '../storage/authStorage';
import { colors } from '../styles/colors';
import {
  EMAIL_MAX_LENGTH,
  loginFormSchema,
  PASSWORD_MAX_LENGTH,
  type LoginFormValues,
} from '../utils/validators';
import type { RootStackParamList } from '../navigation/types';

const PAD = 16;

type Navigation = StackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<Navigation>();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const onValidSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const dataLogin = await loginRequest({
        email: data.email.trim(),
        password: data.password,
      });

      await saveSession({
        accessToken: dataLogin.accessToken,
        user: {
          userId: dataLogin.userId,
          userName: dataLogin.username,
          email: dataLogin.email,
        },
        offlineSession: false,
      });

      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e: unknown) {
      const msg = getAxiosErrorMessage(e, 'Login gagal. Periksa kredensial Anda.');
      Alert.alert('Login gagal', msg);
    } finally {
      setLoading(false);
    }
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Email"
                placeholder="contoh@mail.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                maxLength={EMAIL_MAX_LENGTH}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Password"
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                maxLength={PASSWORD_MAX_LENGTH}
                error={errors.password?.message}
              />
            )}
          />

          <View style={styles.space8} />

          <CustomButton title="Login" loading={loading} disabled={!isValid} onPress={onValidSubmit} />

          <View style={styles.space12} />

        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: PAD,
    flexGrow: 1,
  },
  space8: { height: 8 },
  space12: { height: 12 },
});

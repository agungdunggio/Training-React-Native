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
import { getAxiosErrorMessage, loginRequest, registerUserRequest } from '../api/authApi';
import { saveSession } from '../storage/authStorage';
import { colors } from '../styles/colors';
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  registerFormSchema,
  USER_NAME_MAX_LENGTH,
  type RegisterFormValues,
} from '../utils/validators';
import type { RootStackParamList } from '../navigation/types';

const PAD = 16;

type Navigation = StackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<Navigation>();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { userName: '', email: '', password: '' },
  });

  const onValidSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const created = await registerUserRequest({
        userName: data.userName,
        email: data.email.trim(),
        password: data.password,
      });

      try {
        const loginData = await loginRequest({
          email: data.email.trim(),
          password: data.password,
        });

        await saveSession({
          accessToken: loginData.accessToken,
          user: {
            userId: loginData.userId,
            userName: loginData.username,
            email: loginData.email,
          },
          offlineSession: false,
        });
      } catch {
        await saveSession({
          accessToken: created.accessToken,
          user: {
            userId: created.userId,
            userName: created.username,
            email: created.email,
          },
          offlineSession: false,
        });
      }

      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (e: unknown) {
      const msg = getAxiosErrorMessage(e, 'Register gagal. Coba lagi nanti.');
      Alert.alert('Register gagal', msg);
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
          <Text style={styles.title}>Buat akun</Text>
          <Text style={styles.subtitle}>Lengkapi data di bawah ini.</Text>

          <View style={styles.space16} />

          <Controller
            control={control}
            name="userName"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="User Name"
                placeholder="Nama pengguna"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                maxLength={USER_NAME_MAX_LENGTH}
                error={errors.userName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Email"
                placeholder="email@domain.com"
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
                placeholder="Minimal 4 karakter"
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

          <CustomButton
            title="Register"
            loading={loading}
            disabled={!isValid}
            onPress={onValidSubmit}
          />

          <View style={styles.space12} />

          <CustomButton
            title="Sudah punya akun? Login"
            variant="secondary"
            disabled={loading}
            onPress={() => navigation.navigate('Login')}
          />
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.gray600,
  },
  space8: { height: 8 },
  space12: { height: 12 },
  space16: { height: 16 },
});

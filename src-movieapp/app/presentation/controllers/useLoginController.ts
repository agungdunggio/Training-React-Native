import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { loginSchema, type LoginFormValues } from '../utils/validators';
import { AuthService } from '../../domain/services/auth_service';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;


export function useLoginController() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const authService = AuthService.getInstance();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { username: '', password: '' },
  });

  
  const onLoginSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const user = await authService.loginUseCase.execute(data.username, data.password);
      Alert.alert('Sukses', `Selamat datang kembali, ${user.username}!`);
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (e: any) {
      const msg = e.message || 'Terjadi kesalahan saat masuk.';
      Alert.alert('Login Gagal', msg);
    } finally {
      setLoading(false);
    }
  });

  const onGuestLogin = async () => {
    setLoading(true);
    try {
      await authService.loginGuestUseCase.execute();
      Alert.alert('Masuk Sebagai Tamu', 'Selamat datang! Anda masuk dengan akses terbatas.');
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (e: any) {
      const msg = e.message || 'Gagal masuk sebagai tamu.';
      Alert.alert('Kesalahan', msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    control,
    errors,
    isValid,
    loading,
    onLoginSubmit,
    onGuestLogin,
    reset,
  };
}

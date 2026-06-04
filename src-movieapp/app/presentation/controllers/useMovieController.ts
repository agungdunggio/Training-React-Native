import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { AuthService } from '../../domain/services/auth_service';
import { MovieService } from '../../domain/services/movie_service';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function useMovieController() {
  const navigation = useNavigation<NavigationProp>();
  const authService = AuthService.getInstance();
  const movieService = MovieService.getInstance();

  const getPopularMovies = async (language: string = 'id-ID') => {
    return await movieService.getPopularMoviesUseCase.execute(language);
  };

  const guardRestrictedAction = async (actionLabel: string, callback: () => void) => {
    try {
      const activeSession = await authService.getSessionUseCase.execute();
      
      authService.checkRestrictionUseCase.execute(activeSession, actionLabel);
      
      callback();
    } catch (e: any) {
      if (e.name === 'GuestRestrictionError') {
        Alert.alert(
          'Fitur Khusus Pengguna',
          `Anda masuk sebagai Tamu. Untuk menikmati fitur '${actionLabel}', silakan masuk dengan akun terdaftar Anda.`,
          [
            { text: 'Batal', style: 'cancel' },
            {
              text: 'Masuk Sekarang',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Gagal', e.message || 'Terjadi kesalahan sistem.');
      }
    }
  };

  const navigateToAccount = async () => {
    await guardRestrictedAction('Mengakses Menu Akun', () => {
      navigation.navigate('Account');
    });
  };

  return {
    guardRestrictedAction,
    navigateToAccount,
    getPopularMovies,
  };
}

import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { AuthService } from '../../domain/services/auth_service';
import type { User } from '../../domain/models/user';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

/**
 * Controller Hook managing global session bootstrapping (App startup checking)
 * and logout functionality.
 */
export function useAuthController() {
  const [booting, setBooting] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const authService = AuthService.getInstance();
  const navigation = useNavigation<NavigationProp>();

  // Fetch active session on startup
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const session = await authService.getSessionUseCase.execute();
        if (active) {
          setCurrentUser(session);
        }
      } catch (e) {
        console.error('Error bootstrapping session:', e);
      } finally {
        if (active) {
          setBooting(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [authService]);

  /**
   * Triggers secure session clearance and resets navigation to Login flow.
   */
  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah Anda yakin ingin keluar dari aplikasi?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          try {
            await authService.logoutUseCase.execute();
            setCurrentUser(null);
            
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } catch (e: any) {
            Alert.alert('Gagal Keluar', e.message || 'Terjadi kesalahan.');
          }
        },
      },
    ]);
  };

  return {
    booting,
    currentUser,
    handleLogout,
  };
}

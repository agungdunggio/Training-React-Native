import SecureStorage from 'react-native-fast-secure-storage';
import type { UserEntity } from '../entities/user_entity';

const KEYS = {
  TOKEN: '@movieapp/accessToken',
  USERNAME: '@movieapp/username',
  IS_GUEST: '@movieapp/isGuest',
} as const;

export class AuthLocalSource {
  async saveSession(token: string, username: string): Promise<void> {
    await SecureStorage.setItem(KEYS.TOKEN, token);
    await SecureStorage.setItem(KEYS.USERNAME, username);
    await SecureStorage.setItem(KEYS.IS_GUEST, 'false');
  }

  async saveGuestSession(): Promise<void> {
    await SecureStorage.removeItem(KEYS.TOKEN);
    await SecureStorage.removeItem(KEYS.USERNAME);
    await SecureStorage.setItem(KEYS.IS_GUEST, 'true');
  }

  async getSession(): Promise<UserEntity | null> {
    try {
      const isGuestStr = await SecureStorage.getItem(KEYS.IS_GUEST);
      const isGuest = isGuestStr === 'true';

      if (isGuest) {
        return {
          id: 'guest',
          username: 'Guest User',
          role: 'guest',
        };
      }

      const token = await SecureStorage.getItem(KEYS.TOKEN);
      const username = await SecureStorage.getItem(KEYS.USERNAME);

      if (token && username) {
        return {
          id: 'user_authenticated',
          username,
          token,
          role: 'user',
        };
      }

      return null;
    } catch {
      return null;
    }
  }

  async clearSession(): Promise<void> {
    try {
      await SecureStorage.removeItem(KEYS.TOKEN);
      await SecureStorage.removeItem(KEYS.USERNAME);
      await SecureStorage.removeItem(KEYS.IS_GUEST);
    } catch (e) {
      console.error('Failed to clear secure storage keys:', e);
    }
  }
}

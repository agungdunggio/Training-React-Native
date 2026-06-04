import axios from 'axios';
import { tmdbClient } from './tmdb_client';
import { TMDB_ACCESS_TOKEN } from '@env';
import type { UserEntity } from '../entities/user_entity';

export class AuthRemoteSource {
  async login(username: string, password: string): Promise<UserEntity> {
    if (!TMDB_ACCESS_TOKEN || TMDB_ACCESS_TOKEN === 'YOUR_TMDB_READ_ACCESS_TOKEN') {
      throw new Error('Access Token TMDB belum dikonfigurasi. Harap masukkan Read Access Token Anda di berkas .env di root proyek.');
    }

    try {
      const tokenResponse = await tmdbClient.get('/authentication/token/new');
      const requestToken = tokenResponse.data.request_token;

      await tmdbClient.post('/authentication/token/validate_with_login', {
        username,
        password,
        request_token: requestToken
      });

      const sessionResponse = await tmdbClient.post('/authentication/session/new', {
        request_token: requestToken
      });
      const sessionId = sessionResponse.data.session_id;

      const accountResponse = await tmdbClient.get('/account', {
        params: { session_id: sessionId }
      });
      const accountData = accountResponse.data;

      return {
        id: accountData.id,
        username: accountData.username,
        email: `${accountData.username.toLowerCase()}@tmdb.org`,
        token: sessionId,
        role: 'user'
      };

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const statusCode = responseData?.status_code;

        if (statusCode === 30 || statusCode === 33) {
          throw new Error('Kredensial tidak valid. Silakan coba lagi.');
        }
        if (statusCode === 7) {
          throw new Error('API Key TMDB tidak valid. Harap periksa konfigurasi Anda.');
        }

        const errorMessage = responseData?.status_message || error.message;
        throw new Error(`Gagal Login TMDB: ${errorMessage}`);
      }

      throw new Error(error instanceof Error ? error.message : 'Terjadi kesalahan sistem saat melakukan login.');
    }
  }
}

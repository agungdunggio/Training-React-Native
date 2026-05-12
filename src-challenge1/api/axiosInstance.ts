import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { getAccessToken } from '../storage/authStorage';

export const BASE_URL = 'http://192.168.101.224:3000/api/v1';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await getAccessToken();
      const isLocalFallback = token && String(token).startsWith('local-');
      if (token && !isLocalFallback && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      console.error('Error getting access token');
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

import type { AxiosError } from 'axios';
import { axiosInstance } from './axiosInstance';


export type LoginRegisterResponse = {
  userId: number;
  username: string;
  email: string;
  accessToken: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export async function loginRequest(credentials: LoginCredentials): Promise<LoginRegisterResponse> {
  const { data } = await axiosInstance.post<LoginRegisterResponse>('/auth/login', {
    email: credentials.email.trim(),
    password: credentials.password,
  });
  console.log('Login url:', axiosInstance.defaults.baseURL + '/auth/login');
  console.log('Login response:', data);

  return data;
}

export type RegisterPayload = {
  userName: string;
  email: string;
  password: string;
};

export async function registerUserRequest(payload: RegisterPayload): Promise<LoginRegisterResponse> {
  const body = {
    username: payload.userName.trim(),
    email: payload.email.trim(),
    password: payload.password,
  };

  const response = await axiosInstance.post<LoginRegisterResponse>('/auth/register', body);
  return response.data;
}

export function getAxiosErrorMessage(error: unknown, fallback: string): string {
  const err = error as AxiosError<{ message?: string }>;
  const msg = err?.response?.data?.message ?? err?.message;
  return msg != null ? String(msg) : fallback;
}

import type { InferType } from 'yup';
import * as yup from 'yup';

export const USERNAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 4;

export const loginSchema = yup.object({
  username: yup
    .string()
    .transform((v) => (v == null ? '' : String(v)).trim())
    .required('Nama pengguna wajib diisi')
    .max(USERNAME_MAX_LENGTH, `Nama pengguna maksimal ${USERNAME_MAX_LENGTH} karakter`),
  password: yup
    .string()
    .transform((v) => (v == null ? '' : String(v)))
    .required('Kata sandi wajib diisi')
    .min(PASSWORD_MIN_LENGTH, `Kata sandi minimal ${PASSWORD_MIN_LENGTH} karakter`),
});

export type LoginFormValues = InferType<typeof loginSchema>;

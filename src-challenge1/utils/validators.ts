import type { InferType } from 'yup';
import * as yup from 'yup';

export const EMAIL_MAX_LENGTH = 20;
export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_MAX_LENGTH = 10;
export const USER_NAME_MAX_LENGTH = 50;

export type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailFieldSchema = yup
  .string()
  .transform((v) => (v == null ? '' : String(v)).trim())
  .required('Wajib diisi')
  .max(EMAIL_MAX_LENGTH, `Email maksimal ${EMAIL_MAX_LENGTH} karakter`)
  .matches(EMAIL_REGEX, 'Format email tidak valid');

export const passwordFieldSchema = yup
  .string()
  .transform((v) => (v == null ? '' : String(v)))
  .required('Wajib diisi')
  .min(PASSWORD_MIN_LENGTH, `Password ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} karakter`)
  .max(PASSWORD_MAX_LENGTH, `Password ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} karakter`)
  .matches(/^[a-zA-Z0-9]+$/, 'Password hanya huruf dan angka');

export const userNameFieldSchema = yup
  .string()
  .transform((v) => (v == null ? '' : String(v)).trim())
  .required('Wajib diisi')
  .max(USER_NAME_MAX_LENGTH, `Nama pengguna maksimal ${USER_NAME_MAX_LENGTH} karakter`);

export const loginFormSchema = yup.object({
  email: emailFieldSchema,
  password: passwordFieldSchema,
});

export const registerFormSchema = yup.object({
  userName: userNameFieldSchema,
  email: emailFieldSchema,
  password: passwordFieldSchema,
});

export type LoginFormValues = InferType<typeof loginFormSchema>;
export type RegisterFormValues = InferType<typeof registerFormSchema>;

function catchYupToResult(schema: yup.AnySchema, value: unknown): ValidationResult {
  try {
    schema.validateSync(value, { abortEarly: true, strict: false });
    return { ok: true };
  } catch (e) {
    if (e instanceof yup.ValidationError && e.message) {
      return { ok: false, message: e.message };
    }
    return { ok: false, message: 'Tidak valid' };
  }
}

export function validateRequired(value: unknown): ValidationResult {
  return catchYupToResult(yup.string().trim().required('Wajib diisi'), value);
}

export function validateEmail(value: unknown): ValidationResult {
  return catchYupToResult(emailFieldSchema, value);
}

export function validatePassword(value: unknown): ValidationResult {
  return catchYupToResult(passwordFieldSchema, value);
}

export function validateUserName(value: unknown): ValidationResult {
  return catchYupToResult(userNameFieldSchema, value);
}

export function isLoginFormValid(email: string, password: string): boolean {
  try {
    loginFormSchema.validateSync(
      { email, password },
      { abortEarly: false, strict: false },
    );
    return true;
  } catch {
    return false;
  }
}

export function isRegisterFormValid(userName: string, email: string, password: string): boolean {
  try {
    registerFormSchema.validateSync(
      { userName, email, password },
      { abortEarly: false, strict: false },
    );
    return true;
  } catch {
    return false;
  }
}

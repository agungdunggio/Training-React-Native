import type { User } from '../models/user';

export interface AuthRepository {
  login(username: string, password: string): Promise<User>;
  loginAsGuest(): Promise<User>;
  getActiveSession(): Promise<User | null>;
  logout(): Promise<void>;
}

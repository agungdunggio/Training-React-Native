import type { AuthRepository } from '../repositories/auth_repository';
import type { User } from '../models/user';

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(username: string, password: string): Promise<User> {
    if (!username || username.trim().length === 0) {
      throw new Error('Nama pengguna wajib diisi');
    }
    if (!password || password.length === 0) {
      throw new Error('Kata sandi wajib diisi');
    }
    
    return await this.authRepository.login(username.trim(), password);
  }
}

import type { AuthRepository } from '../repositories/auth_repository';
import type { User } from '../models/user';

export class LoginGuestUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<User> {
    return await this.authRepository.loginAsGuest();
  }
}

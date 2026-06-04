import type { AuthRepository } from '../repositories/auth_repository';
import type { User } from '../models/user';

export class GetSessionUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<User | null> {
    return await this.authRepository.getActiveSession();
  }
}

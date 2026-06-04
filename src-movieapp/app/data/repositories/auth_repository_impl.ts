import type { AuthRepository } from '../../domain/repositories/auth_repository';
import type { User } from '../../domain/models/user';
import type { UserEntity } from '../entities/user_entity';
import { AuthLocalSource } from '../data_sources/auth_local_source';
import { AuthRemoteSource } from '../data_sources/auth_remote_source';

export class AuthRepositoryImpl implements AuthRepository {
  private localSource: AuthLocalSource;
  private remoteSource: AuthRemoteSource;

  constructor() {
    this.localSource = new AuthLocalSource();
    this.remoteSource = new AuthRemoteSource();
  }

  async login(username: string, password: string): Promise<User> {
    const userEntity = await this.remoteSource.login(username, password);
    
    if (userEntity.token) {
      await this.localSource.saveSession(userEntity.token, userEntity.username);
    }
    
    return this.mapToDomain(userEntity);
  }

  async loginAsGuest(): Promise<User> {
    await this.localSource.saveGuestSession();
    return {
      id: 'guest',
      username: 'Guest User',
      isGuest: true,
    };
  }

  async getActiveSession(): Promise<User | null> {
    const entity = await this.localSource.getSession();
    if (!entity) return null;
    return this.mapToDomain(entity);
  }

  async logout(): Promise<void> {
    await this.localSource.clearSession();
  }

  private mapToDomain(entity: UserEntity): User {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      isGuest: entity.role === 'guest',
      token: entity.token,
    };
  }
}

import { AuthRepositoryImpl } from '../../data/repositories/auth_repository_impl';
import type { AuthRepository } from '../repositories/auth_repository';
import { LoginUseCase } from '../use_cases/login_use_case';
import { LoginGuestUseCase } from '../use_cases/login_guest_use_case';
import { LogoutUseCase } from '../use_cases/logout_use_case';
import { GetSessionUseCase } from '../use_cases/get_session_use_case';
import { CheckRestrictionUseCase } from '../use_cases/check_restriction_use_case';

export class AuthService {
  private static instance: AuthService | null = null;

  private repository: AuthRepository;
  
  public loginUseCase: LoginUseCase;
  public loginGuestUseCase: LoginGuestUseCase;
  public logoutUseCase: LogoutUseCase;
  public getSessionUseCase: GetSessionUseCase;
  public checkRestrictionUseCase: CheckRestrictionUseCase;

  private constructor() {
    this.repository = new AuthRepositoryImpl();
    
    this.loginUseCase = new LoginUseCase(this.repository);
    this.loginGuestUseCase = new LoginGuestUseCase(this.repository);
    this.logoutUseCase = new LogoutUseCase(this.repository);
    this.getSessionUseCase = new GetSessionUseCase(this.repository);
    this.checkRestrictionUseCase = new CheckRestrictionUseCase();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
}

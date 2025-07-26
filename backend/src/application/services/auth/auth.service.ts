import { injectable, inject } from 'tsyringe';
import { RegisterUserUseCase } from '../../use-cases/auth/register-user.usecase';
import { LoginUserDTO, RegisterUserDTO } from '../../dtos/auth.dto';
import { IAuthService } from '../../../domain/services/IAuth.service';
import { RegisterUserResult } from '../../../domain/user-cases/auth/IRegister-user.usecase';
import { LoginUserUseCase } from '../../use-cases/auth/login-user.usecase';
import { LogoutUserUseCase } from '../../use-cases/auth/logout-user.usecase';
import { LoginUserResult } from '../../../domain/user-cases/auth/ILogin-user.usecase';
import { LogoutUserResult } from '../../../domain/user-cases/auth/ILogout-user.usecase';

@injectable()
export class AuthService implements IAuthService{
  constructor(
    @inject(RegisterUserUseCase) private registerUserUseCase: RegisterUserUseCase,
    @inject(LoginUserUseCase) private loginUserUseCase: LoginUserUseCase,
    @inject(LogoutUserUseCase) private logoutUserUseCase: LogoutUserUseCase
  ) {}

  async registerUser(userData: RegisterUserDTO): Promise<RegisterUserResult> {
    return await this.registerUserUseCase.execute(userData);
  }

  async loginUser(loginData: LoginUserDTO): Promise<LoginUserResult> {
    return await this.loginUserUseCase.execute(loginData);
  }

  async logoutUser(): Promise<LogoutUserResult> {
    return await this.logoutUserUseCase.execute();
  }
}
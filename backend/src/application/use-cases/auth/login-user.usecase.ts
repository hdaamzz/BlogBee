import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
import { LoginUserDTO } from '../../dtos/auth.dto';
import { PasswordUtil } from '../../../shared/utils/password.util';
import { StatusCode } from '../../../shared/constants/status-codes.enum';
import { ResponseMessage } from '../../../shared/constants/messages.enum';
import { JWTPayload, JWTUtil } from '../../../shared/utils/jwt.util';
import { LoginUserResult } from '../../../domain/user-cases/auth/Ilogin-user.usecase';


@injectable()
export class LoginUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository
  ) {}

  async execute(loginData: LoginUserDTO): Promise<LoginUserResult> {
    try {
      const user = await this.userRepository.findByEmail(loginData.email);
      if (!user) {
        return {
          success: false,
          statusCode: StatusCode.UNAUTHORIZED,
          message: ResponseMessage.INVALID_CREDENTIALS
        };
      }

      const isValidPassword = await PasswordUtil.compare(loginData.password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          statusCode: StatusCode.UNAUTHORIZED,
          message: ResponseMessage.INVALID_CREDENTIALS
        };
      }

      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email.value,
        name: user.name
      };
      
      const token = JWTUtil.generateToken(tokenPayload);

      return {
        success: true,
        statusCode: StatusCode.SUCCESS,
        message: ResponseMessage.USER_LOGIN_SUCCESS,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email.value,
            createdAt: user.createdAt
          },
          token
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        message: ResponseMessage.LOGIN_FAILED
      };
    }
  }
}
import { injectable, inject } from 'tsyringe';
import { IUserRepository } from '../../../domain/interfaces/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { RegisterUserDTO } from '../../dtos/auth.dto';
import { PasswordUtil } from '../../../shared/utils/password.util';
import { StatusCode } from '../../../shared/constants/status-codes.enum';
import { ResponseMessage } from '../../../shared/constants/messages.enum';
import { IRegisterUserUseCase, RegisterUserResult } from '../../../domain/user-cases/auth/IRegister-user.usecase';


@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: IUserRepository
  ) {}

  async execute(userData: RegisterUserDTO): Promise<RegisterUserResult> {
    try {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          statusCode: StatusCode.CONFLICT,
          message: ResponseMessage.USER_ALREADY_EXISTS
        };
      }

      const hashedPassword = await PasswordUtil.hash(userData.password);

      const user = User.create(userData.name, userData.email, hashedPassword);

      const savedUser = await this.userRepository.create(user);

      return {
        success: true,
        statusCode: StatusCode.CREATED,
        message: ResponseMessage.USER_REGISTERED_SUCCESS,
        data: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email.value,
          createdAt: savedUser.createdAt
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        message: ResponseMessage.REGISTRATION_FAILED
      };
    }
  }
}
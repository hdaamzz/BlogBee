import { RegisterUserDTO, UserResponseDTO } from "../../../application/dtos/auth.dto";
import { StatusCode } from "../../../shared/constants/status-codes.enum";

export interface RegisterUserResult {
  success: boolean;
  statusCode: StatusCode;
  message: string;
  data?: UserResponseDTO;
}

export interface IRegisterUserUseCase {
  execute(userData: RegisterUserDTO): Promise<RegisterUserResult>;
}
import { LoginUserDTO, UserResponseDTO } from "../../../application/dtos/auth.dto";
import { StatusCode } from "../../../shared/constants/status-codes.enum";

export interface LoginUserResult {
  success: boolean;
  statusCode: StatusCode;
  message: string;
  data?: {
    user: UserResponseDTO;
    token: string;
  };
}
export interface ILoginUserUseCase {
  execute(loginData: LoginUserDTO): Promise<LoginUserResult>;
}
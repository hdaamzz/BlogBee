import { UserResponseDTO } from "../../../application/dtos/auth.dto";
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
import { StatusCode } from "../../../shared/constants/status-codes.enum";

export interface LogoutUserResult {
  success: boolean;
  statusCode: StatusCode;
  message: string;
}

export interface ILogoutUserUseCase {
  execute(): Promise<LogoutUserResult>;
}
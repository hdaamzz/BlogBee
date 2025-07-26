import { injectable } from "tsyringe";
import { LogoutUserResult } from "../../../domain/user-cases/auth/ILogout-user.usecase";
import { StatusCode } from "../../../shared/constants/status-codes.enum";
import { ResponseMessage } from "../../../shared/constants/messages.enum";



@injectable()
export class LogoutUserUseCase {
  async execute(): Promise<LogoutUserResult> {

    return {
      success: true,
      statusCode: StatusCode.SUCCESS,
      message: ResponseMessage.USER_LOGOUT_SUCCESS
    };
  }
}
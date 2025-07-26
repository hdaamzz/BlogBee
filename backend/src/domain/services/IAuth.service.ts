import { LoginUserDTO, RegisterUserDTO } from "../../application/dtos/auth.dto";
import { LoginUserResult } from "../user-cases/auth/ILogin-user.usecase";
import { LogoutUserResult } from "../user-cases/auth/ILogout-user.usecase";
import { RegisterUserResult } from "../user-cases/auth/IRegister-user.usecase";

export interface IAuthService {
    registerUser(userData: RegisterUserDTO): Promise<RegisterUserResult>
    loginUser(userDate:LoginUserDTO): Promise<LoginUserResult>
    logoutUser(): Promise<LogoutUserResult>
}
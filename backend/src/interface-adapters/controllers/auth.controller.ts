import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { ResponseUtil } from '../../shared/utils/response.util';
import { LoginUserDTO, RegisterUserDTO } from '../../application/dtos/auth.dto';
import { IAuthController } from '../../domain/controllers/IAuth.controller';
import { IAuthService } from '../../domain/services/IAuth.service';
import { JWTUtil } from '../../shared/utils/jwt.util';

@injectable()
export class AuthController implements IAuthController{
  constructor(
    @inject("AuthService") private authService: IAuthService
  ) {}

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const userData: RegisterUserDTO = req.body;
      const result = await this.authService.registerUser(userData);
      
      if (result.success) {
        return ResponseUtil.success(res, result.data, result.message, result.statusCode);
      } else {
        return ResponseUtil.error(res, result.message, result.statusCode);
      }
    } catch (error) {
      console.error('Registration controller error:', error);
      return ResponseUtil.error(res, 'Internal server error');
    }
  }

async login(req: Request, res: Response): Promise<Response> {
    try {
      const loginData: LoginUserDTO = req.body;      
      const result = await this.authService.loginUser(loginData);
      
      if (result.success && result.data) {
        JWTUtil.setTokenCookie(res, result.data.token);
        
        return ResponseUtil.success(
          res, 
          { user: result.data.user }, 
          result.message, 
          result.statusCode
        );
      } else {
        return ResponseUtil.error(res, result.message, result.statusCode);
      }
    } catch (error) {
      console.error('Login controller error:', error);
      return ResponseUtil.error(res, 'Internal server error');
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    try {
      const result = await this.authService.logoutUser();
      
      JWTUtil.clearTokenCookie(res);
      
      return ResponseUtil.success(res, null, result.message, result.statusCode);
    } catch (error) {
      console.error('Logout controller error:', error);
      return ResponseUtil.error(res, 'Internal server error');
    }
  }

  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      
      return ResponseUtil.success(
        res, 
        { user }, 
        'Profile retrieved successfully'
      );
    } catch (error) {
      console.error('Get profile controller error:', error);
      return ResponseUtil.error(res, 'Internal server error');
    }
  }
}
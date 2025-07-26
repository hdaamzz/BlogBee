import jwt from 'jsonwebtoken';
import { Response } from 'express';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export class JWTUtil {
  private static readonly JWT_SECRET = process.env.JWT_SECRET;
  private static readonly COOKIE_NAME = 'auth_token';

  static generateToken(payload: JWTPayload): string {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '7d',
    });
  }

  static verifyToken(token: string): JWTPayload {
    if (!this.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    try {
      return jwt.verify(token, this.JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static setTokenCookie(res: Response, token: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie(this.COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction, 
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });
  }

  static clearTokenCookie(res: Response): void {
    res.clearCookie(this.COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });
  }

  static getCookieName(): string {
    return this.COOKIE_NAME;
  }
}
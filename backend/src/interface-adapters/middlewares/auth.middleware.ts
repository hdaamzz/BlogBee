import { Request, Response, NextFunction } from 'express';
import { JWTUtil, JWTPayload } from '../../shared/utils/jwt.util';
import { ResponseUtil } from '../../shared/utils/response.util';
import { StatusCode } from '../../shared/constants/status-codes.enum';
import { ResponseMessage } from '../../shared/constants/messages.enum';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies[JWTUtil.getCookieName()];

    if (!token) {
      return ResponseUtil.error(
        res,
        ResponseMessage.UNAUTHORIZED,
        StatusCode.UNAUTHORIZED
      );
    }

    const decoded = JWTUtil.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return ResponseUtil.error(
      res,
      ResponseMessage.TOKEN_INVALID,
      StatusCode.UNAUTHORIZED
    );
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies[JWTUtil.getCookieName()];

    if (token) {
      const decoded = JWTUtil.verifyToken(token);
      req.user = decoded;
    }
    next();
  } catch (error) {
    next();
  }
};
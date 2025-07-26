import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ResponseUtil } from '../../shared/utils/response.util';
import { StatusCode } from '../../shared/constants/status-codes.enum';
import { ResponseMessage } from '../../shared/constants/messages.enum';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return ResponseUtil.error(
        res,
        ResponseMessage.VALIDATION_ERROR,
        StatusCode.BAD_REQUEST,
        errors
      );
    }
    
    next();
  };
};
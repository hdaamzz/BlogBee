import { Response } from 'express';
import { IApiResponse, IErrorResponse } from '../interfaces/response.interface';
import { StatusCode } from '../constants/status-codes.enum';

export class ResponseUtil {
  static success<T>(
    res: Response,
    data: T,
    message: string,
    statusCode: StatusCode = StatusCode.SUCCESS
  ): Response {
    const response: IApiResponse<T> = {
      success: true,
      statusCode,
      message,
      data
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR,
    errors?: string[]
  ): Response {
    const response: IErrorResponse = {
      success: false,
      statusCode,
      message,
      errors
    };
    return res.status(statusCode).json(response);
  }
}
import { StatusCode } from '../constants/status-codes.enum';

export interface IApiResponse<T = any> {
  success: boolean;
  statusCode: StatusCode;
  message: string;
  data?: T;
  errors?: string[];
}

export interface IErrorResponse {
  success: boolean;
  statusCode: StatusCode;
  message: string;
  errors?: string[];
}
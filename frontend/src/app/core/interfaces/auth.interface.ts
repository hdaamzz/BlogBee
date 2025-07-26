export interface IRegister{
    name:string,
    email:string,
    password:string,
}

export interface RegisterResponse {
  data: User 
  message: string;
  statusCode: number;
  success: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: User;
  };
}

export interface LoginFormData {
  email: string;
  password: string;
}


export interface ILogin{
    email:string,
    password:string,
}

export interface User{
    id:string;
    name:string;
    email:string;
    createdAt:string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

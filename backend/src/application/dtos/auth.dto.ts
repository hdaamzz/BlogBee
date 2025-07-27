export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface TokenPayloadDTO {
  userId: string;
  email: string;
}
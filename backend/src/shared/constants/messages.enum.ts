export enum ResponseMessage {
  USER_REGISTERED_SUCCESS = "User registered successfully",
  USER_LOGIN_SUCCESS = "User logged in successfully",
  USER_LOGOUT_SUCCESS = "User logged out successfully",
  
  USER_ALREADY_EXISTS = "User already exists with this email",
  INVALID_CREDENTIALS = "Invalid email or password",
  USER_NOT_FOUND = "User not found with this email",
  REGISTRATION_FAILED = "Registration failed. Please try again",
  LOGIN_FAILED = "Login failed. Please try again",
  INTERNAL_ERROR = "Something went wrong. Please try again later",
  VALIDATION_ERROR = "Validation failed",
  UNAUTHORIZED = "Unauthorized access",
  TOKEN_EXPIRED = "Token has expired",
  TOKEN_INVALID = "Invalid token",
  
  EMAIL_REQUIRED = "Email is required",
  EMAIL_INVALID = "Please provide a valid email address",
  PASSWORD_REQUIRED = "Password is required",
  PASSWORD_MIN_LENGTH = "Password must be at least 6 characters long",
  NAME_REQUIRED = "Name is required"
}
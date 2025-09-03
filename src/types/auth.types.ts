export type UserRole = 'hr' | 'interviewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface VerifyTokenResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

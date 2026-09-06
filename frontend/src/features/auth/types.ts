export type UserRole = "student" | "admin";

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  full_name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterResponse {
  user: User;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export type AuthResponse = LoginResponse;

export interface ApiError {
  detail: string;
}

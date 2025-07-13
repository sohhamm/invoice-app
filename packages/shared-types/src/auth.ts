export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
  expiresIn: string;
}

export interface AuthenticatedRequest {
  user?: User;
}
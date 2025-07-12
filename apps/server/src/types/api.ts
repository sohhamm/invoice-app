import type { Request } from 'express';
import type { User } from '@/db';

// Backend-specific types
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Invoice types for the API
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

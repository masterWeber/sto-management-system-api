import type { Request } from 'express';
import type { Role } from '../domain/role.js';

export interface AuthenticatedUser {
  userId: string;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

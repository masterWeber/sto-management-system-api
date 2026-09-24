import type { Role } from '../../../shared/domain/role.js';

export const AUTH_TOKEN_SERVICE = Symbol('AUTH_TOKEN_SERVICE');

export interface AuthTokenPayload {
  userId: number;
  role: Role;
}

export interface AuthTokenService {
  issue(payload: AuthTokenPayload): Promise<string>;
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  AuthTokenPayload,
  AuthTokenService,
} from '../application/ports/auth-token.port.js';

@Injectable()
export class JwtAuthTokenService implements AuthTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async issue(payload: AuthTokenPayload): Promise<string> {
    return this.jwtService.signAsync({ sub: payload.userId, role: payload.role });
  }
}

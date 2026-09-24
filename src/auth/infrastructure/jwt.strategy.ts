import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../staff/domain/staff-repository.port.js';
import type { AuthenticatedUser } from '../../shared/interface/authenticated-request.js';

interface JwtPayload {
  sub: string;
  role: AuthenticatedUser['role'];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'dev-secret-change-me',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const staff = await this.staffRepository.findByPublicId(payload.sub);
    if (!staff || !staff.isActive) {
      throw new UnauthorizedException();
    }
    return { userId: staff.publicId, role: staff.role };
  }
}
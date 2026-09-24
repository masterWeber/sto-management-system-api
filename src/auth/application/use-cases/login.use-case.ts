import { Inject, Injectable } from '@nestjs/common';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../../../shared/application/ports/password-hasher.port.js';
import { ValidationError } from '../../../shared/domain/errors/domain-error.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../../staff/domain/staff-repository.port.js';
import {
  AUTH_TOKEN_SERVICE,
  type AuthTokenService,
} from '../ports/auth-token.port.js';

export interface LoginInput {
  login: string;
  password: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(AUTH_TOKEN_SERVICE) private readonly authTokenService: AuthTokenService,
  ) {}

  async execute(input: LoginInput): Promise<string> {
    const staffUser = await this.staffRepository.findByLogin(input.login);
    if (!staffUser || !staffUser.isActive) {
      throw new ValidationError('Invalid login or password');
    }

    const passwordMatches = await this.passwordHasher.verify(
      input.password,
      staffUser.passwordHash,
    );
    if (!passwordMatches) {
      throw new ValidationError('Invalid login or password');
    }

    return this.authTokenService.issue({ userId: staffUser.id!, role: staffUser.role });
  }
}

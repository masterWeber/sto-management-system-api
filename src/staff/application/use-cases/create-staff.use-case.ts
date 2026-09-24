import { Inject, Injectable } from '@nestjs/common';
import {
  PASSWORD_HASHER,
  type PasswordHasher,
} from '../../../shared/application/ports/password-hasher.port.js';
import { ConflictError } from '../../../shared/domain/errors/domain-error.js';
import type { Role } from '../../../shared/domain/role.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../domain/staff-repository.port.js';
import { StaffUser } from '../../domain/staff-user.entity.js';

export interface CreateStaffInput {
  fullName: string;
  login: string;
  password: string;
  role: Role;
}

@Injectable()
export class CreateStaffUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateStaffInput): Promise<StaffUser> {
    const existing = await this.staffRepository.findByLogin(input.login);
    if (existing) throw new ConflictError(`Login "${input.login}" is already taken`);

    const passwordHash = await this.passwordHasher.hash(input.password);
    const staffUser = new StaffUser(
      undefined,
      input.fullName,
      input.login,
      passwordHash,
      input.role,
    );
    return this.staffRepository.save(staffUser);
  }
}

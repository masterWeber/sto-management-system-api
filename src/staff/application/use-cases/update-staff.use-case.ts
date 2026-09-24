import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import type { Role } from '../../../shared/domain/role.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../domain/staff-repository.port.js';
import { StaffUser } from '../../domain/staff-user.entity.js';

export interface UpdateStaffInput {
  fullName?: string;
  role?: Role;
}

@Injectable()
export class UpdateStaffUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
  ) {}

  async execute(publicId: string, input: UpdateStaffInput): Promise<StaffUser> {
    const staffUser = await this.staffRepository.findByPublicId(publicId);
    if (!staffUser) throw new NotFoundError('StaffUser', publicId);

    if (input.fullName !== undefined) staffUser.fullName = input.fullName;
    if (input.role !== undefined) staffUser.changeRole(input.role);

    return this.staffRepository.save(staffUser);
  }
}

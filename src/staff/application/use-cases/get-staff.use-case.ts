import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../domain/staff-repository.port.js';
import { StaffUser } from '../../domain/staff-user.entity.js';

@Injectable()
export class GetStaffUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
  ) {}

  async execute(publicId: string): Promise<StaffUser> {
    const staffUser = await this.staffRepository.findByPublicId(publicId);
    if (!staffUser) throw new NotFoundError('StaffUser', publicId);
    return staffUser;
  }
}

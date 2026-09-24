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

  async execute(id: number): Promise<StaffUser> {
    const staffUser = await this.staffRepository.findById(id);
    if (!staffUser) throw new NotFoundError('StaffUser', id);
    return staffUser;
  }
}

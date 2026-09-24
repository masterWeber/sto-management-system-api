import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../domain/staff-repository.port.js';

@Injectable()
export class DeactivateStaffUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const staffUser = await this.staffRepository.findById(id);
    if (!staffUser) throw new NotFoundError('StaffUser', id);
    staffUser.deactivate();
    await this.staffRepository.save(staffUser);
  }
}

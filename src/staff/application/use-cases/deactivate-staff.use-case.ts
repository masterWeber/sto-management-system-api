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

  async execute(publicId: string): Promise<void> {
    const staffUser = await this.staffRepository.findByPublicId(publicId);
    if (!staffUser) throw new NotFoundError('StaffUser', publicId);
    staffUser.deactivate();
    await this.staffRepository.save(staffUser);
  }
}

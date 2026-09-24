import { Inject, Injectable } from '@nestjs/common';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../domain/staff-repository.port.js';
import { StaffUser } from '../../domain/staff-user.entity.js';

@Injectable()
export class ListStaffUseCase {
  constructor(
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
  ) {}

  async execute(): Promise<StaffUser[]> {
    return this.staffRepository.findAll();
  }
}

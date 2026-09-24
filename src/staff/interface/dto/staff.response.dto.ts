import type { StaffUser } from '../../domain/staff-user.entity.js';
import type { Role } from '../../../shared/domain/role.js';

export class StaffResponseDto {
  id: number;
  fullName: string;
  login: string;
  role: Role;
  isActive: boolean;

  private constructor(staffUser: StaffUser) {
    this.id = staffUser.id!;
    this.fullName = staffUser.fullName;
    this.login = staffUser.login;
    this.role = staffUser.role;
    this.isActive = staffUser.isActive;
  }

  static fromDomain(staffUser: StaffUser): StaffResponseDto {
    return new StaffResponseDto(staffUser);
  }
}

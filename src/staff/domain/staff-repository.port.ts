import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { StaffUser } from './staff-user.entity.js';

export const STAFF_REPOSITORY = Symbol('STAFF_REPOSITORY');

export interface StaffRepository {
  findById(id: number): Promise<StaffUser | null>;
  findByLogin(login: string): Promise<StaffUser | null>;
  findAll(pagination: PaginationParams): Promise<PaginatedResult<StaffUser>>;
  save(staffUser: StaffUser): Promise<StaffUser>;
}

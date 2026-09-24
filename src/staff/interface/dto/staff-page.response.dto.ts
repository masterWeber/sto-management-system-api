import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { StaffUser } from '../../domain/staff-user.entity.js';
import { StaffResponseDto } from './staff.response.dto.js';

export class StaffPageResponseDto {
  items: StaffResponseDto[];
  total: number;
  page: number;
  limit: number;

  private constructor(result: PaginatedResult<StaffUser>) {
    this.items = result.items.map(StaffResponseDto.fromDomain);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }

  static fromDomain(result: PaginatedResult<StaffUser>): StaffPageResponseDto {
    return new StaffPageResponseDto(result);
  }
}

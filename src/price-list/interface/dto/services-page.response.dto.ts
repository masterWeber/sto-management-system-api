import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { ServiceView } from '../../application/service-view.js';
import { ServiceResponseDto } from './service.response.dto.js';

export class ServicesPageResponseDto {
  items: ServiceResponseDto[];
  total: number;
  page: number;
  limit: number;

  private constructor(result: PaginatedResult<ServiceView>) {
    this.items = result.items.map(ServiceResponseDto.fromView);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }

  static fromDomain(result: PaginatedResult<ServiceView>): ServicesPageResponseDto {
    return new ServicesPageResponseDto(result);
  }
}

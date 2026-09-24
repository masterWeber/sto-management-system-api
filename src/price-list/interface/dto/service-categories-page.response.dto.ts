import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { ServiceCategory } from '../../domain/service-category.entity.js';
import { ServiceCategoryResponseDto } from './service-category.response.dto.js';

export class ServiceCategoriesPageResponseDto {
  items: ServiceCategoryResponseDto[];
  total: number;
  page: number;
  limit: number;

  private constructor(result: PaginatedResult<ServiceCategory>) {
    this.items = result.items.map(ServiceCategoryResponseDto.fromDomain);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }

  static fromDomain(result: PaginatedResult<ServiceCategory>): ServiceCategoriesPageResponseDto {
    return new ServiceCategoriesPageResponseDto(result);
  }
}

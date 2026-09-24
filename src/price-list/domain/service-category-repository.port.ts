import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { ServiceCategory } from './service-category.entity.js';

export const SERVICE_CATEGORY_REPOSITORY = Symbol('SERVICE_CATEGORY_REPOSITORY');

export interface ServiceCategoryRepository {
  findById(id: number): Promise<ServiceCategory | null>;
  findByPublicId(publicId: string): Promise<ServiceCategory | null>;
  findAll(pagination: PaginationParams): Promise<PaginatedResult<ServiceCategory>>;
  save(category: ServiceCategory): Promise<ServiceCategory>;
  delete(id: number): Promise<void>;
}

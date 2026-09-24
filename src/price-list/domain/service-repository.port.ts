import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { Service } from './service.entity.js';

export const SERVICE_REPOSITORY = Symbol('SERVICE_REPOSITORY');

export interface ServiceSearchFilters {
  search?: string;
  categoryId?: number;
}

export interface ServiceRepository {
  findById(id: number): Promise<Service | null>;
  findByPublicId(publicId: string): Promise<Service | null>;
  findAll(
    filters: ServiceSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Service>>;
  save(service: Service): Promise<Service>;
  delete(id: number): Promise<void>;
}

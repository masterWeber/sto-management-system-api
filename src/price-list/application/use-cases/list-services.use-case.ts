import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResult, PaginationParams } from '../../../shared/domain/pagination.js';
import {
  SERVICE_CATEGORY_REPOSITORY,
  type ServiceCategoryRepository,
} from '../../domain/service-category-repository.port.js';
import { SERVICE_REPOSITORY, type ServiceRepository } from '../../domain/service-repository.port.js';
import type { ServiceView } from '../service-view.js';

export interface ListServicesFilters {
  search?: string;
  categoryId?: string;
}

@Injectable()
export class ListServicesUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository,
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ServiceCategoryRepository,
  ) {}

  async execute(
    filters: ListServicesFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ServiceView>> {
    let categoryId: number | undefined;
    if (filters.categoryId !== undefined) {
      const category = await this.categoryRepository.findByPublicId(filters.categoryId);
      if (!category) {
        return { items: [], total: 0, page: pagination.page, limit: pagination.limit };
      }
      categoryId = category.id!;
    }

    const result = await this.serviceRepository.findAll(
      { search: filters.search, categoryId },
      pagination,
    );

    // ponytail: one lookup per distinct category on the page (bounded by page size <=100), not a join —
    // upgrade to a query-builder join if the service list grows large enough for this to matter.
    const uniqueCategoryIds = [...new Set(result.items.map((service) => service.categoryId))];
    const categories = await Promise.all(
      uniqueCategoryIds.map((id) => this.categoryRepository.findById(id)),
    );
    const publicIdByCategoryId = new Map(
      categories.map((category, index) => [uniqueCategoryIds[index], category!.publicId]),
    );

    return {
      ...result,
      items: result.items.map((service) => ({
        service,
        categoryPublicId: publicIdByCategoryId.get(service.categoryId)!,
      })),
    };
  }
}

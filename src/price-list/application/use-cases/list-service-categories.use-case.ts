import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResult, PaginationParams } from '../../../shared/domain/pagination.js';
import {
  SERVICE_CATEGORY_REPOSITORY,
  type ServiceCategoryRepository,
} from '../../domain/service-category-repository.port.js';
import { ServiceCategory } from '../../domain/service-category.entity.js';

@Injectable()
export class ListServiceCategoriesUseCase {
  constructor(
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ServiceCategoryRepository,
  ) {}

  async execute(pagination: PaginationParams): Promise<PaginatedResult<ServiceCategory>> {
    return this.categoryRepository.findAll(pagination);
  }
}

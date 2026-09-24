import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResult, PaginationParams } from '../../../shared/domain/pagination.js';
import {
  PRODUCT_CATEGORY_REPOSITORY,
  type ProductCategoryRepository,
} from '../../domain/product-category-repository.port.js';
import { ProductCategory } from '../../domain/product-category.entity.js';

@Injectable()
export class ListProductCategoriesUseCase {
  constructor(
    @Inject(PRODUCT_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ProductCategoryRepository,
  ) {}

  async execute(pagination: PaginationParams): Promise<PaginatedResult<ProductCategory>> {
    return this.categoryRepository.findAll(pagination);
  }
}

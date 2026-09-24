import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResult, PaginationParams } from '../../../shared/domain/pagination.js';
import {
  PRODUCT_CATEGORY_REPOSITORY,
  type ProductCategoryRepository,
} from '../../domain/product-category-repository.port.js';
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../domain/product-repository.port.js';
import type { ProductView } from '../product-view.js';

export interface ListProductsFilters {
  search?: string;
  sku?: string;
  inStock?: boolean;
  categoryId?: string;
}

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    @Inject(PRODUCT_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ProductCategoryRepository,
  ) {}

  async execute(
    filters: ListProductsFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ProductView>> {
    let categoryId: number | undefined;
    if (filters.categoryId !== undefined) {
      const category = await this.categoryRepository.findByPublicId(filters.categoryId);
      if (!category) {
        return { items: [], total: 0, page: pagination.page, limit: pagination.limit };
      }
      categoryId = category.id!;
    }

    const result = await this.productRepository.findAll(
      { search: filters.search, sku: filters.sku, inStock: filters.inStock, categoryId },
      pagination,
    );

    // ponytail: one lookup per distinct category on the page (bounded by page size <=100), not a join —
    // upgrade to a query-builder join if the product list grows large enough for this to matter.
    const uniqueCategoryIds = [...new Set(result.items.map((product) => product.categoryId))];
    const categories = await Promise.all(
      uniqueCategoryIds.map((id) => this.categoryRepository.findById(id)),
    );
    const publicIdByCategoryId = new Map(
      categories.map((category, index) => [uniqueCategoryIds[index], category!.publicId]),
    );

    return {
      ...result,
      items: result.items.map((product) => ({
        product,
        categoryPublicId: publicIdByCategoryId.get(product.categoryId)!,
      })),
    };
  }
}

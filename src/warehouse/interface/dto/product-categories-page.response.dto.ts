import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { ProductCategory } from '../../domain/product-category.entity.js';
import { ProductCategoryResponseDto } from './product-category.response.dto.js';

export class ProductCategoriesPageResponseDto {
  items: ProductCategoryResponseDto[];
  total: number;
  page: number;
  limit: number;

  private constructor(result: PaginatedResult<ProductCategory>) {
    this.items = result.items.map(ProductCategoryResponseDto.fromDomain);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }

  static fromDomain(result: PaginatedResult<ProductCategory>): ProductCategoriesPageResponseDto {
    return new ProductCategoriesPageResponseDto(result);
  }
}

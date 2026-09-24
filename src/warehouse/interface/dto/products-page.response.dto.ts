import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { ProductView } from '../../application/product-view.js';
import { ProductResponseDto } from './product.response.dto.js';

export class ProductsPageResponseDto {
  items: ProductResponseDto[];
  total: number;
  page: number;
  limit: number;

  private constructor(result: PaginatedResult<ProductView>) {
    this.items = result.items.map(ProductResponseDto.fromView);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }

  static fromDomain(result: PaginatedResult<ProductView>): ProductsPageResponseDto {
    return new ProductsPageResponseDto(result);
  }
}

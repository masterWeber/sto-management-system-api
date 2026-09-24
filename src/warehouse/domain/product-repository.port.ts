import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { Product } from './product.entity.js';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductSearchFilters {
  search?: string;
  sku?: string;
  inStock?: boolean;
  categoryId?: number;
}

export interface ProductRepository {
  findById(id: number): Promise<Product | null>;
  findByPublicId(publicId: string): Promise<Product | null>;
  findAll(
    filters: ProductSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>>;
  save(product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
}

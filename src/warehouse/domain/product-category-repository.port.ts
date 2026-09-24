import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { ProductCategory } from './product-category.entity.js';

export const PRODUCT_CATEGORY_REPOSITORY = Symbol('PRODUCT_CATEGORY_REPOSITORY');

export interface ProductCategoryRepository {
  findById(id: number): Promise<ProductCategory | null>;
  findByPublicId(publicId: string): Promise<ProductCategory | null>;
  findAll(pagination: PaginationParams): Promise<PaginatedResult<ProductCategory>>;
  save(category: ProductCategory): Promise<ProductCategory>;
  delete(id: number): Promise<void>;
}

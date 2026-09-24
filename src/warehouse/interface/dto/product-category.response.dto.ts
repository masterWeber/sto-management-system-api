import type { ProductCategory } from '../../domain/product-category.entity.js';

export class ProductCategoryResponseDto {
  id: string;
  name: string;

  private constructor(category: ProductCategory) {
    this.id = category.publicId;
    this.name = category.name;
  }

  static fromDomain(category: ProductCategory): ProductCategoryResponseDto {
    return new ProductCategoryResponseDto(category);
  }
}

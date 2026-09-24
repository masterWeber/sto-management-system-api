import type { ProductView } from '../../application/product-view.js';

export class ProductResponseDto {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  inStock: boolean;
  categoryId: string;

  private constructor(view: ProductView) {
    this.id = view.product.publicId;
    this.name = view.product.name;
    this.sku = view.product.sku;
    this.quantity = view.product.quantity;
    this.inStock = view.product.isInStock();
    this.categoryId = view.categoryPublicId;
  }

  static fromView(view: ProductView): ProductResponseDto {
    return new ProductResponseDto(view);
  }
}

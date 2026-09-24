import type { Product } from '../domain/product.entity.js';

export interface ProductView {
  product: Product;
  categoryPublicId: string;
}

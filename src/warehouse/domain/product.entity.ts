import { randomUUID } from 'node:crypto';
import { ValidationError } from '../../shared/domain/errors/domain-error.js';

export class Product {
  constructor(
    public readonly id: number | undefined,
    public name: string,
    public sku: string,
    public quantity: number,
    public readonly categoryId: number,
    public readonly publicId: string = randomUUID(),
  ) {
    Product.assertValidName(name);
    Product.assertValidQuantity(quantity);
  }

  isInStock(): boolean {
    return this.quantity > 0;
  }

  update(input: { name?: string; sku?: string; quantity?: number }): void {
    if (input.name !== undefined) {
      Product.assertValidName(input.name);
      this.name = input.name;
    }
    if (input.sku !== undefined) this.sku = input.sku;
    if (input.quantity !== undefined) {
      Product.assertValidQuantity(input.quantity);
      this.quantity = input.quantity;
    }
  }

  private static assertValidName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Product name is required');
    }
  }

  private static assertValidQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new ValidationError('Product quantity must be a non-negative integer');
    }
  }
}

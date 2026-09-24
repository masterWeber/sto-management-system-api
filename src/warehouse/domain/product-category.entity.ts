import { randomUUID } from 'node:crypto';
import { ValidationError } from '../../shared/domain/errors/domain-error.js';

export class ProductCategory {
  constructor(
    public readonly id: number | undefined,
    public name: string,
    public readonly publicId: string = randomUUID(),
  ) {
    ProductCategory.assertValidName(name);
  }

  rename(name: string): void {
    ProductCategory.assertValidName(name);
    this.name = name;
  }

  private static assertValidName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Product category name is required');
    }
  }
}

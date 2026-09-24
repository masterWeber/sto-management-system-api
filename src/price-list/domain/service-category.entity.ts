import { randomUUID } from 'node:crypto';
import { ValidationError } from '../../shared/domain/errors/domain-error.js';

export class ServiceCategory {
  constructor(
    public readonly id: number | undefined,
    public name: string,
    public readonly publicId: string = randomUUID(),
  ) {
    ServiceCategory.assertValidName(name);
  }

  rename(name: string): void {
    ServiceCategory.assertValidName(name);
    this.name = name;
  }

  private static assertValidName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Service category name is required');
    }
  }
}

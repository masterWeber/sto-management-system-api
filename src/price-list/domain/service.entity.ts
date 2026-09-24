import { randomUUID } from 'node:crypto';
import { Money } from '../../shared/domain/money.vo.js';
import { ValidationError } from '../../shared/domain/errors/domain-error.js';

export class Service {
  constructor(
    public readonly id: number | undefined,
    public name: string,
    public price: Money,
    public readonly categoryId: number,
    public readonly publicId: string = randomUUID(),
  ) {
    Service.assertValidName(name);
  }

  update(input: { name?: string; price?: Money }): void {
    if (input.name !== undefined) {
      Service.assertValidName(input.name);
      this.name = input.name;
    }
    if (input.price !== undefined) this.price = input.price;
  }

  private static assertValidName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Service name is required');
    }
  }
}

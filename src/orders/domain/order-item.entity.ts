import { randomUUID } from 'node:crypto';
import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { Money } from '../../shared/domain/money.vo.js';

export class OrderItem {
  constructor(
    public readonly id: number | undefined,
    public readonly serviceId: number | undefined,
    public name: string,
    public price: Money,
    public readonly publicId: string = randomUUID(),
  ) {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Order item name is required');
    }
  }
}

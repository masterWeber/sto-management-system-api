import { randomUUID } from 'node:crypto';
import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { Money } from '../../shared/domain/money.vo.js';

export class Expense {
  constructor(
    public readonly id: number | undefined,
    public date: Date,
    public amount: Money,
    public description: string,
    public category: string | undefined,
    public readonly publicId: string = randomUUID(),
  ) {
    Expense.assertValidDescription(description);
  }

  update(input: {
    date?: Date;
    amount?: Money;
    description?: string;
    category?: string;
  }): void {
    if (input.date !== undefined) this.date = input.date;
    if (input.amount !== undefined) this.amount = input.amount;
    if (input.description !== undefined) {
      Expense.assertValidDescription(input.description);
      this.description = input.description;
    }
    if (input.category !== undefined) this.category = input.category;
  }

  private static assertValidDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new ValidationError('Expense description is required');
    }
  }
}

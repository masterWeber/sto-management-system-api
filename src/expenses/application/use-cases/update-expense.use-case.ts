import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { Money } from '../../../shared/domain/money.vo.js';
import {
  EXPENSE_REPOSITORY,
  type ExpenseRepository,
} from '../../domain/expense-repository.port.js';
import { Expense } from '../../domain/expense.entity.js';

export interface UpdateExpenseInput {
  date?: Date;
  amountKopecks?: number;
  description?: string;
  category?: string;
}

@Injectable()
export class UpdateExpenseUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(publicId: string, input: UpdateExpenseInput): Promise<Expense> {
    const expense = await this.expenseRepository.findByPublicId(publicId);
    if (!expense) throw new NotFoundError('Expense', publicId);

    expense.update({
      date: input.date,
      amount: input.amountKopecks !== undefined ? Money.ofKopecks(input.amountKopecks) : undefined,
      description: input.description,
      category: input.category,
    });
    return this.expenseRepository.save(expense);
  }
}

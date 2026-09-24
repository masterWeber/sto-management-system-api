import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  EXPENSE_REPOSITORY,
  type ExpenseRepository,
} from '../../domain/expense-repository.port.js';
import { Expense } from '../../domain/expense.entity.js';

@Injectable()
export class GetExpenseUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(publicId: string): Promise<Expense> {
    const expense = await this.expenseRepository.findByPublicId(publicId);
    if (!expense) throw new NotFoundError('Expense', publicId);
    return expense;
  }
}

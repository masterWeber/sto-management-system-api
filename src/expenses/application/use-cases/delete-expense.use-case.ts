import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  EXPENSE_REPOSITORY,
  type ExpenseRepository,
} from '../../domain/expense-repository.port.js';

@Injectable()
export class DeleteExpenseUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(publicId: string): Promise<void> {
    const expense = await this.expenseRepository.findByPublicId(publicId);
    if (!expense) throw new NotFoundError('Expense', publicId);
    await this.expenseRepository.delete(expense.id!);
  }
}

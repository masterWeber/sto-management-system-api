import { Inject, Injectable } from '@nestjs/common';
import { Money } from '../../../shared/domain/money.vo.js';
import {
  EXPENSE_REPOSITORY,
  type ExpenseRepository,
} from '../../domain/expense-repository.port.js';
import { Expense } from '../../domain/expense.entity.js';

export interface CreateExpenseInput {
  date: Date;
  amountKopecks: number;
  description: string;
  category?: string;
}

@Injectable()
export class CreateExpenseUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(input: CreateExpenseInput): Promise<Expense> {
    const expense = new Expense(
      undefined,
      input.date,
      Money.ofKopecks(input.amountKopecks),
      input.description,
      input.category,
    );
    return this.expenseRepository.save(expense);
  }
}

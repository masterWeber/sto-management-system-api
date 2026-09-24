import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResult, PaginationParams } from '../../../shared/domain/pagination.js';
import {
  EXPENSE_REPOSITORY,
  type ExpenseRepository,
  type ExpenseSearchFilters,
} from '../../domain/expense-repository.port.js';
import { Expense } from '../../domain/expense.entity.js';

@Injectable()
export class ListExpensesUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY) private readonly expenseRepository: ExpenseRepository,
  ) {}

  async execute(
    filters: ExpenseSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Expense>> {
    return this.expenseRepository.findAll(filters, pagination);
  }
}

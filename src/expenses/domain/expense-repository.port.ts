import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { Expense } from './expense.entity.js';

export const EXPENSE_REPOSITORY = Symbol('EXPENSE_REPOSITORY');

export interface ExpenseSearchFilters {
  from?: Date;
  to?: Date;
  category?: string;
}

export interface ExpenseRepository {
  findById(id: number): Promise<Expense | null>;
  findByPublicId(publicId: string): Promise<Expense | null>;
  findAll(
    filters: ExpenseSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Expense>>;
  save(expense: Expense): Promise<Expense>;
  delete(id: number): Promise<void>;
}

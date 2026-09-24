import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { Expense } from '../../domain/expense.entity.js';
import { ExpenseResponseDto } from './expense.response.dto.js';

export class ExpensesPageResponseDto {
  items: ExpenseResponseDto[];
  total: number;
  page: number;
  limit: number;

  private constructor(result: PaginatedResult<Expense>) {
    this.items = result.items.map(ExpenseResponseDto.fromDomain);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }

  static fromDomain(result: PaginatedResult<Expense>): ExpensesPageResponseDto {
    return new ExpensesPageResponseDto(result);
  }
}

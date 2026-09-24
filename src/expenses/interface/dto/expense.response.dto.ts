import type { Expense } from '../../domain/expense.entity.js';

export class ExpenseResponseDto {
  id: string;
  date: Date;
  amountKopecks: number;
  description: string;
  category: string | null;

  private constructor(expense: Expense) {
    this.id = expense.publicId;
    this.date = expense.date;
    this.amountKopecks = expense.amount.toKopecks();
    this.description = expense.description;
    this.category = expense.category ?? null;
  }

  static fromDomain(expense: Expense): ExpenseResponseDto {
    return new ExpenseResponseDto(expense);
  }
}

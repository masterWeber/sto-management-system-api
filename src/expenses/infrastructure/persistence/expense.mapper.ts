import { Expense } from '../../domain/expense.entity.js';
import { Money } from '../../../shared/domain/money.vo.js';
import { ExpenseOrmEntity } from './expense.orm-entity.js';

export class ExpenseMapper {
  static toDomain(orm: ExpenseOrmEntity): Expense {
    return new Expense(
      orm.id,
      // the 'date' column comes back from the pg driver as a plain 'YYYY-MM-DD' string, not a Date
      orm.date instanceof Date ? orm.date : new Date(orm.date),
      Money.ofKopecks(orm.amountKopecks),
      orm.description,
      orm.category ?? undefined,
      orm.publicId,
    );
  }

  static toPersistence(expense: Expense): ExpenseOrmEntity {
    const orm = new ExpenseOrmEntity();
    if (expense.id !== undefined) orm.id = expense.id;
    orm.publicId = expense.publicId;
    orm.date = expense.date;
    orm.amountKopecks = expense.amount.toKopecks();
    orm.description = expense.description;
    orm.category = expense.category;
    return orm;
  }
}

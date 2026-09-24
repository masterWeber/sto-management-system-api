import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { Money } from '../../shared/domain/money.vo.js';
import { Expense } from './expense.entity.js';

describe('Expense', () => {
  it('creates an expense with a description', () => {
    const expense = new Expense(
      undefined,
      new Date('2026-01-15'),
      Money.ofKopecks(500000),
      'Rent',
      'utilities',
    );
    expect(expense.description).toBe('Rent');
    expect(expense.amount.toKopecks()).toBe(500000);
    expect(expense.category).toBe('utilities');
  });

  it('allows an expense without a category', () => {
    const expense = new Expense(undefined, new Date(), Money.ofKopecks(1000), 'Misc', undefined);
    expect(expense.category).toBeUndefined();
  });

  it('rejects an empty description on creation', () => {
    expect(() => new Expense(undefined, new Date(), Money.ofKopecks(1000), '', undefined)).toThrow(
      ValidationError,
    );
  });

  describe('update', () => {
    it('updates only the provided fields', () => {
      const expense = new Expense(
        undefined,
        new Date('2026-01-15'),
        Money.ofKopecks(500000),
        'Rent',
        'utilities',
      );
      expense.update({ amount: Money.ofKopecks(550000) });
      expect(expense.amount.toKopecks()).toBe(550000);
      expect(expense.description).toBe('Rent');
    });

    it('rejects an empty description on update', () => {
      const expense = new Expense(undefined, new Date(), Money.ofKopecks(1000), 'Rent', undefined);
      expect(() => expense.update({ description: '' })).toThrow(ValidationError);
    });
  });
});

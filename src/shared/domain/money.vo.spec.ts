import { ValidationError } from './errors/domain-error.js';
import { Money } from './money.vo.js';

describe('Money', () => {
  it('creates a value from a non-negative integer number of kopecks', () => {
    expect(Money.ofKopecks(1500).toKopecks()).toBe(1500);
  });

  it('creates a zero value', () => {
    expect(Money.zero().toKopecks()).toBe(0);
  });

  it('rejects a negative amount', () => {
    expect(() => Money.ofKopecks(-1)).toThrow(ValidationError);
  });

  it('rejects a non-integer amount', () => {
    expect(() => Money.ofKopecks(10.5)).toThrow(ValidationError);
  });

  it('adds two amounts', () => {
    const sum = Money.ofKopecks(1000).add(Money.ofKopecks(250));
    expect(sum.toKopecks()).toBe(1250);
  });

  it('compares equality by amount', () => {
    expect(Money.ofKopecks(500).equals(Money.ofKopecks(500))).toBe(true);
    expect(Money.ofKopecks(500).equals(Money.ofKopecks(501))).toBe(false);
  });
});

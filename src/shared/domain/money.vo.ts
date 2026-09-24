import { ValidationError } from './errors/domain-error.js';

export class Money {
  private constructor(private readonly kopecks: number) {
    if (!Number.isInteger(kopecks) || kopecks < 0) {
      throw new ValidationError('Money amount must be a non-negative integer number of kopecks');
    }
  }

  static ofKopecks(kopecks: number): Money {
    return new Money(kopecks);
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return new Money(this.kopecks + other.kopecks);
  }

  equals(other: Money): boolean {
    return this.kopecks === other.kopecks;
  }

  toKopecks(): number {
    return this.kopecks;
  }
}

import { randomUUID } from 'node:crypto';
import { ValidationError } from '../../shared/domain/errors/domain-error.js';

export class Client {
  constructor(
    public readonly id: number | undefined,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public readonly publicId: string = randomUUID(),
  ) {
    Client.assertValidPhone(phone);
  }

  rename(firstName: string, lastName: string): void {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  changePhone(phone: string): void {
    Client.assertValidPhone(phone);
    this.phone = phone;
  }

  private static assertValidPhone(phone: string): void {
    if (!phone || phone.trim().length === 0) {
      throw new ValidationError('Client phone is required');
    }
  }
}

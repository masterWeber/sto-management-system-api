import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { Client } from './client.entity.js';

describe('Client', () => {
  it('creates a client with a valid phone', () => {
    const client = new Client(undefined, 'Ivan', 'Ivanov', '+79001234567');
    expect(client.phone).toBe('+79001234567');
  });

  it('rejects an empty phone on creation', () => {
    expect(() => new Client(undefined, 'Ivan', 'Ivanov', '')).toThrow(ValidationError);
  });

  it('rejects an empty phone on changePhone', () => {
    const client = new Client(undefined, 'Ivan', 'Ivanov', '+79001234567');
    expect(() => client.changePhone('   ')).toThrow(ValidationError);
  });
});

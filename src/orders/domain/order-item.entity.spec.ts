import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { Money } from '../../shared/domain/money.vo.js';
import { OrderItem } from './order-item.entity.js';

describe('OrderItem', () => {
  it('creates an item with a name and price', () => {
    const item = new OrderItem(undefined, 5, 'Oil change', Money.ofKopecks(150000));
    expect(item.name).toBe('Oil change');
    expect(item.price.toKopecks()).toBe(150000);
    expect(item.serviceId).toBe(5);
  });

  it('allows a manual item with no serviceId', () => {
    const item = new OrderItem(undefined, undefined, 'Custom repair', Money.ofKopecks(50000));
    expect(item.serviceId).toBeUndefined();
  });

  it('rejects an empty name', () => {
    expect(() => new OrderItem(undefined, undefined, '', Money.ofKopecks(1000))).toThrow(
      ValidationError,
    );
  });
});

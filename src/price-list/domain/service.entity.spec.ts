import { Money } from '../../shared/domain/money.vo.js';
import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { Service } from './service.entity.js';

describe('Service', () => {
  it('creates a service with a name and price', () => {
    const service = new Service(undefined, 'Oil change', Money.ofKopecks(150000), 1);
    expect(service.name).toBe('Oil change');
    expect(service.price.toKopecks()).toBe(150000);
    expect(service.categoryId).toBe(1);
  });

  it('rejects an empty name on creation', () => {
    expect(() => new Service(undefined, '', Money.ofKopecks(1000), 1)).toThrow(ValidationError);
  });

  describe('update', () => {
    it('updates only the provided fields', () => {
      const service = new Service(undefined, 'Oil change', Money.ofKopecks(150000), 1);
      service.update({ price: Money.ofKopecks(200000) });
      expect(service.price.toKopecks()).toBe(200000);
      expect(service.name).toBe('Oil change');
    });

    it('rejects an empty name on update', () => {
      const service = new Service(undefined, 'Oil change', Money.ofKopecks(150000), 1);
      expect(() => service.update({ name: '' })).toThrow(ValidationError);
    });
  });
});

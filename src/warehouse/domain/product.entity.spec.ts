import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { Product } from './product.entity.js';

describe('Product', () => {
  it('creates a product with a name, sku and quantity', () => {
    const product = new Product(undefined, 'Oil filter', 'OF-100', 5, 1);
    expect(product.name).toBe('Oil filter');
    expect(product.sku).toBe('OF-100');
    expect(product.quantity).toBe(5);
  });

  it('rejects an empty name on creation', () => {
    expect(() => new Product(undefined, '', 'OF-100', 5, 1)).toThrow(ValidationError);
  });

  it('rejects a negative quantity on creation', () => {
    expect(() => new Product(undefined, 'Oil filter', 'OF-100', -1, 1)).toThrow(ValidationError);
  });

  it('rejects a non-integer quantity on creation', () => {
    expect(() => new Product(undefined, 'Oil filter', 'OF-100', 1.5, 1)).toThrow(ValidationError);
  });

  describe('isInStock', () => {
    it('is true when quantity is greater than zero', () => {
      expect(new Product(undefined, 'Oil filter', 'OF-100', 1, 1).isInStock()).toBe(true);
    });

    it('is false when quantity is zero', () => {
      expect(new Product(undefined, 'Oil filter', 'OF-100', 0, 1).isInStock()).toBe(false);
    });
  });

  describe('update', () => {
    it('updates only the provided fields', () => {
      const product = new Product(undefined, 'Oil filter', 'OF-100', 5, 1);
      product.update({ quantity: 10 });
      expect(product.quantity).toBe(10);
      expect(product.name).toBe('Oil filter');
    });

    it('rejects a negative quantity on update', () => {
      const product = new Product(undefined, 'Oil filter', 'OF-100', 5, 1);
      expect(() => product.update({ quantity: -5 })).toThrow(ValidationError);
    });

    it('rejects an empty name on update', () => {
      const product = new Product(undefined, 'Oil filter', 'OF-100', 5, 1);
      expect(() => product.update({ name: '' })).toThrow(ValidationError);
    });
  });
});

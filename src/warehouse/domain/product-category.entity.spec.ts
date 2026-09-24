import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { ProductCategory } from './product-category.entity.js';

describe('ProductCategory', () => {
  it('creates a category with a valid name', () => {
    const category = new ProductCategory(undefined, 'Filters');
    expect(category.name).toBe('Filters');
  });

  it('rejects an empty name on creation', () => {
    expect(() => new ProductCategory(undefined, '')).toThrow(ValidationError);
  });

  it('rejects an empty name on rename', () => {
    const category = new ProductCategory(undefined, 'Filters');
    expect(() => category.rename('  ')).toThrow(ValidationError);
  });

  it('renames the category', () => {
    const category = new ProductCategory(undefined, 'Filters');
    category.rename('Brake pads');
    expect(category.name).toBe('Brake pads');
  });
});

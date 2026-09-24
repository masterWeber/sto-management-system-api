import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { ServiceCategory } from './service-category.entity.js';

describe('ServiceCategory', () => {
  it('creates a category with a valid name', () => {
    const category = new ServiceCategory(undefined, 'Diagnostics');
    expect(category.name).toBe('Diagnostics');
  });

  it('rejects an empty name on creation', () => {
    expect(() => new ServiceCategory(undefined, '')).toThrow(ValidationError);
  });

  it('rejects an empty name on rename', () => {
    const category = new ServiceCategory(undefined, 'Diagnostics');
    expect(() => category.rename('   ')).toThrow(ValidationError);
  });

  it('renames the category', () => {
    const category = new ServiceCategory(undefined, 'Diagnostics');
    category.rename('Engine repair');
    expect(category.name).toBe('Engine repair');
  });
});

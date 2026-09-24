import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { Car } from './car.entity.js';

describe('Car', () => {
  it('creates a car with a valid license plate', () => {
    const car = new Car(undefined, 'Toyota', 2020, 'A123BC77', 'JTDBT4K3X0J000001', 1);
    expect(car.licensePlate).toBe('A123BC77');
    expect(car.make).toBe('Toyota');
    expect(car.year).toBe(2020);
    expect(car.vin).toBe('JTDBT4K3X0J000001');
    expect(car.clientId).toBe(1);
  });

  it('allows creating a car without a VIN', () => {
    const car = new Car(undefined, 'Kia', 2019, 'B222CC77', undefined, 1);
    expect(car.vin).toBeUndefined();
  });

  it('rejects an empty license plate on creation', () => {
    expect(() => new Car(undefined, 'Toyota', 2020, '', undefined, 1)).toThrow(ValidationError);
  });

  it('rejects a whitespace-only license plate on creation', () => {
    expect(() => new Car(undefined, 'Toyota', 2020, '   ', undefined, 1)).toThrow(ValidationError);
  });

  it('auto-generates a unique publicId when none is given', () => {
    const a = new Car(undefined, 'Toyota', 2020, 'A123BC77', undefined, 1);
    const b = new Car(undefined, 'Kia', 2019, 'B222CC77', undefined, 1);
    expect(a.publicId).toMatch(/^[0-9a-f-]{36}$/);
    expect(a.publicId).not.toBe(b.publicId);
  });

  describe('update', () => {
    it('updates only the provided fields', () => {
      const car = new Car(undefined, 'Toyota', 2020, 'A123BC77', 'VIN1', 1);
      car.update({ year: 2021 });
      expect(car.year).toBe(2021);
      expect(car.make).toBe('Toyota');
      expect(car.licensePlate).toBe('A123BC77');
      expect(car.vin).toBe('VIN1');
    });

    it('updates make, licensePlate and vin together', () => {
      const car = new Car(undefined, 'Toyota', 2020, 'A123BC77', 'VIN1', 1);
      car.update({ make: 'Lexus', licensePlate: 'X999XX99', vin: 'VIN2' });
      expect(car.make).toBe('Lexus');
      expect(car.licensePlate).toBe('X999XX99');
      expect(car.vin).toBe('VIN2');
    });

    it('rejects an empty license plate on update', () => {
      const car = new Car(undefined, 'Toyota', 2020, 'A123BC77', undefined, 1);
      expect(() => car.update({ licensePlate: '' })).toThrow(ValidationError);
    });

    it('leaves the license plate unchanged if the update throws', () => {
      const car = new Car(undefined, 'Toyota', 2020, 'A123BC77', undefined, 1);
      expect(() => car.update({ licensePlate: '   ' })).toThrow(ValidationError);
      expect(car.licensePlate).toBe('A123BC77');
    });
  });
});

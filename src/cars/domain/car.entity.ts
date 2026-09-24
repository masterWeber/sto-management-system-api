import { randomUUID } from 'node:crypto';
import { ValidationError } from '../../shared/domain/errors/domain-error.js';

export class Car {
  constructor(
    public readonly id: number | undefined,
    public make: string,
    public year: number,
    public licensePlate: string,
    public vin: string | undefined,
    public readonly clientId: number,
    public readonly publicId: string = randomUUID(),
  ) {
    Car.assertValidLicensePlate(licensePlate);
  }

  update(input: { make?: string; year?: number; licensePlate?: string; vin?: string }): void {
    if (input.make !== undefined) this.make = input.make;
    if (input.year !== undefined) this.year = input.year;
    if (input.licensePlate !== undefined) {
      Car.assertValidLicensePlate(input.licensePlate);
      this.licensePlate = input.licensePlate;
    }
    if (input.vin !== undefined) this.vin = input.vin;
  }

  private static assertValidLicensePlate(licensePlate: string): void {
    if (!licensePlate || licensePlate.trim().length === 0) {
      throw new ValidationError('Car license plate is required');
    }
  }
}

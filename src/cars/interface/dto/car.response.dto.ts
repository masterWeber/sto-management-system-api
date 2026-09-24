import type { CarView } from '../../application/car-view.js';

export class CarResponseDto {
  id: string;
  make: string;
  year: number;
  licensePlate: string;
  vin: string | null;
  clientId: string;

  private constructor(view: CarView) {
    this.id = view.car.publicId;
    this.make = view.car.make;
    this.year = view.car.year;
    this.licensePlate = view.car.licensePlate;
    this.vin = view.car.vin ?? null;
    this.clientId = view.clientPublicId;
  }

  static fromView(view: CarView): CarResponseDto {
    return new CarResponseDto(view);
  }
}

import type { Car } from '../domain/car.entity.js';

export interface CarView {
  car: Car;
  clientPublicId: string;
}

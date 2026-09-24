import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { Car } from './car.entity.js';

export const CAR_REPOSITORY = Symbol('CAR_REPOSITORY');

export interface CarSearchFilters {
  licensePlate?: string;
  clientId?: number;
}

export interface CarRepository {
  findById(id: number): Promise<Car | null>;
  findByPublicId(publicId: string): Promise<Car | null>;
  findAll(filters: CarSearchFilters, pagination: PaginationParams): Promise<PaginatedResult<Car>>;
  save(car: Car): Promise<Car>;
  delete(id: number): Promise<void>;
}

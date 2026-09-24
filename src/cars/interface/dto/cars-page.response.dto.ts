import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { CarView } from '../../application/car-view.js';
import { CarResponseDto } from './car.response.dto.js';

export class CarsPageResponseDto {
  items: CarResponseDto[];
  total: number;
  page: number;
  limit: number;

  private constructor(result: PaginatedResult<CarView>) {
    this.items = result.items.map(CarResponseDto.fromView);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }

  static fromDomain(result: PaginatedResult<CarView>): CarsPageResponseDto {
    return new CarsPageResponseDto(result);
  }
}

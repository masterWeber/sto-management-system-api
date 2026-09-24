import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { CarRepository, CarSearchFilters } from '../domain/car-repository.port.js';
import { Car } from '../domain/car.entity.js';
import { CarMapper } from './persistence/car.mapper.js';
import { CarOrmEntity } from './persistence/car.orm-entity.js';

@Injectable()
export class TypeOrmCarRepository implements CarRepository {
  constructor(
    @InjectRepository(CarOrmEntity)
    private readonly repository: Repository<CarOrmEntity>,
  ) {}

  async findById(id: number): Promise<Car | null> {
    const orm = await this.repository.findOneBy({ id });
    return orm ? CarMapper.toDomain(orm) : null;
  }

  async findByPublicId(publicId: string): Promise<Car | null> {
    const orm = await this.repository.findOneBy({ publicId });
    return orm ? CarMapper.toDomain(orm) : null;
  }

  async findAll(
    filters: CarSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Car>> {
    const query = this.repository.createQueryBuilder('car');
    if (filters.licensePlate) {
      query.andWhere('car.licensePlate ILIKE :licensePlate', {
        licensePlate: `%${filters.licensePlate}%`,
      });
    }
    if (filters.clientId !== undefined) {
      query.andWhere('car.clientId = :clientId', { clientId: filters.clientId });
    }
    const [orms, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();
    return {
      items: orms.map(CarMapper.toDomain),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async save(car: Car): Promise<Car> {
    const orm = await this.repository.save(CarMapper.toPersistence(car));
    return CarMapper.toDomain(orm);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

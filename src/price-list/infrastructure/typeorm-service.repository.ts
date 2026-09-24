import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { ServiceRepository, ServiceSearchFilters } from '../domain/service-repository.port.js';
import { Service } from '../domain/service.entity.js';
import { ServiceMapper } from './persistence/service.mapper.js';
import { ServiceOrmEntity } from './persistence/service.orm-entity.js';

@Injectable()
export class TypeOrmServiceRepository implements ServiceRepository {
  constructor(
    @InjectRepository(ServiceOrmEntity)
    private readonly repository: Repository<ServiceOrmEntity>,
  ) {}

  async findById(id: number): Promise<Service | null> {
    const orm = await this.repository.findOneBy({ id });
    return orm ? ServiceMapper.toDomain(orm) : null;
  }

  async findByPublicId(publicId: string): Promise<Service | null> {
    const orm = await this.repository.findOneBy({ publicId });
    return orm ? ServiceMapper.toDomain(orm) : null;
  }

  async findAll(
    filters: ServiceSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Service>> {
    const query = this.repository.createQueryBuilder('service');
    if (filters.search) {
      query.andWhere('service.name ILIKE :search', { search: `%${filters.search}%` });
    }
    if (filters.categoryId !== undefined) {
      query.andWhere('service.categoryId = :categoryId', { categoryId: filters.categoryId });
    }
    const [orms, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();
    return {
      items: orms.map(ServiceMapper.toDomain),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async save(service: Service): Promise<Service> {
    const orm = await this.repository.save(ServiceMapper.toPersistence(service));
    return ServiceMapper.toDomain(orm);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

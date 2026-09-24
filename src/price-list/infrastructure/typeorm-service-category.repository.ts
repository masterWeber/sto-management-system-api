import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import { deleteOrThrowConflict } from '../../shared/infrastructure/delete-or-throw-conflict.js';
import type { ServiceCategoryRepository } from '../domain/service-category-repository.port.js';
import { ServiceCategory } from '../domain/service-category.entity.js';
import { ServiceCategoryMapper } from './persistence/service-category.mapper.js';
import { ServiceCategoryOrmEntity } from './persistence/service-category.orm-entity.js';

@Injectable()
export class TypeOrmServiceCategoryRepository implements ServiceCategoryRepository {
  constructor(
    @InjectRepository(ServiceCategoryOrmEntity)
    private readonly repository: Repository<ServiceCategoryOrmEntity>,
  ) {}

  async findById(id: number): Promise<ServiceCategory | null> {
    const orm = await this.repository.findOneBy({ id });
    return orm ? ServiceCategoryMapper.toDomain(orm) : null;
  }

  async findByPublicId(publicId: string): Promise<ServiceCategory | null> {
    const orm = await this.repository.findOneBy({ publicId });
    return orm ? ServiceCategoryMapper.toDomain(orm) : null;
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<ServiceCategory>> {
    const [orms, total] = await this.repository.findAndCount({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      order: { name: 'ASC' },
    });
    return {
      items: orms.map(ServiceCategoryMapper.toDomain),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async save(category: ServiceCategory): Promise<ServiceCategory> {
    const orm = await this.repository.save(ServiceCategoryMapper.toPersistence(category));
    return ServiceCategoryMapper.toDomain(orm);
  }

  async delete(id: number): Promise<void> {
    await deleteOrThrowConflict(
      () => this.repository.delete(id),
      'Service category has associated services and cannot be deleted',
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import { deleteOrThrowConflict } from '../../shared/infrastructure/delete-or-throw-conflict.js';
import type { ProductCategoryRepository } from '../domain/product-category-repository.port.js';
import { ProductCategory } from '../domain/product-category.entity.js';
import { ProductCategoryMapper } from './persistence/product-category.mapper.js';
import { ProductCategoryOrmEntity } from './persistence/product-category.orm-entity.js';

@Injectable()
export class TypeOrmProductCategoryRepository implements ProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategoryOrmEntity)
    private readonly repository: Repository<ProductCategoryOrmEntity>,
  ) {}

  async findById(id: number): Promise<ProductCategory | null> {
    const orm = await this.repository.findOneBy({ id });
    return orm ? ProductCategoryMapper.toDomain(orm) : null;
  }

  async findByPublicId(publicId: string): Promise<ProductCategory | null> {
    const orm = await this.repository.findOneBy({ publicId });
    return orm ? ProductCategoryMapper.toDomain(orm) : null;
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<ProductCategory>> {
    const [orms, total] = await this.repository.findAndCount({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      order: { name: 'ASC' },
    });
    return {
      items: orms.map(ProductCategoryMapper.toDomain),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async save(category: ProductCategory): Promise<ProductCategory> {
    const orm = await this.repository.save(ProductCategoryMapper.toPersistence(category));
    return ProductCategoryMapper.toDomain(orm);
  }

  async delete(id: number): Promise<void> {
    await deleteOrThrowConflict(
      () => this.repository.delete(id),
      'Product category has associated products and cannot be deleted',
    );
  }
}

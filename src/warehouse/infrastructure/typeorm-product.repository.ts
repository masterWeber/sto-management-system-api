import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { ProductRepository, ProductSearchFilters } from '../domain/product-repository.port.js';
import { Product } from '../domain/product.entity.js';
import { ProductMapper } from './persistence/product.mapper.js';
import { ProductOrmEntity } from './persistence/product.orm-entity.js';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async findById(id: number): Promise<Product | null> {
    const orm = await this.repository.findOneBy({ id });
    return orm ? ProductMapper.toDomain(orm) : null;
  }

  async findByPublicId(publicId: string): Promise<Product | null> {
    const orm = await this.repository.findOneBy({ publicId });
    return orm ? ProductMapper.toDomain(orm) : null;
  }

  async findAll(
    filters: ProductSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Product>> {
    const query = this.repository.createQueryBuilder('product');
    if (filters.search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }
    if (filters.sku) {
      query.andWhere('product.sku ILIKE :sku', { sku: `%${filters.sku}%` });
    }
    if (filters.inStock !== undefined) {
      query.andWhere(filters.inStock ? 'product.quantity > 0' : 'product.quantity = 0');
    }
    if (filters.categoryId !== undefined) {
      query.andWhere('product.categoryId = :categoryId', { categoryId: filters.categoryId });
    }
    const [orms, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();
    return {
      items: orms.map(ProductMapper.toDomain),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async save(product: Product): Promise<Product> {
    const orm = await this.repository.save(ProductMapper.toPersistence(product));
    return ProductMapper.toDomain(orm);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

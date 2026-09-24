import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type {
  ExpenseRepository,
  ExpenseSearchFilters,
} from '../domain/expense-repository.port.js';
import { Expense } from '../domain/expense.entity.js';
import { ExpenseMapper } from './persistence/expense.mapper.js';
import { ExpenseOrmEntity } from './persistence/expense.orm-entity.js';

@Injectable()
export class TypeOrmExpenseRepository implements ExpenseRepository {
  constructor(
    @InjectRepository(ExpenseOrmEntity)
    private readonly repository: Repository<ExpenseOrmEntity>,
  ) {}

  async findById(id: number): Promise<Expense | null> {
    const orm = await this.repository.findOneBy({ id });
    return orm ? ExpenseMapper.toDomain(orm) : null;
  }

  async findByPublicId(publicId: string): Promise<Expense | null> {
    const orm = await this.repository.findOneBy({ publicId });
    return orm ? ExpenseMapper.toDomain(orm) : null;
  }

  async findAll(
    filters: ExpenseSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Expense>> {
    const query = this.repository.createQueryBuilder('expense');
    if (filters.from) {
      query.andWhere('expense.date >= :from', { from: filters.from });
    }
    if (filters.to) {
      query.andWhere('expense.date <= :to', { to: filters.to });
    }
    if (filters.category) {
      query.andWhere('expense.category = :category', { category: filters.category });
    }
    const [orms, total] = await query
      .orderBy('expense.date', 'DESC')
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();
    return {
      items: orms.map(ExpenseMapper.toDomain),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async save(expense: Expense): Promise<Expense> {
    const orm = await this.repository.save(ExpenseMapper.toPersistence(expense));
    return ExpenseMapper.toDomain(orm);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

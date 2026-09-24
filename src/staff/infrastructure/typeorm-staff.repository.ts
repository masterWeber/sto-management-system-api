import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { StaffRepository } from '../domain/staff-repository.port.js';
import { StaffUser } from '../domain/staff-user.entity.js';
import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import { StaffUserMapper } from './persistence/staff-user.mapper.js';
import { StaffUserOrmEntity } from './persistence/staff-user.orm-entity.js';

@Injectable()
export class TypeOrmStaffRepository implements StaffRepository {
  constructor(
    @InjectRepository(StaffUserOrmEntity)
    private readonly repository: Repository<StaffUserOrmEntity>,
  ) {}

  async findById(id: number): Promise<StaffUser | null> {
    const orm = await this.repository.findOneBy({ id });
    return orm ? StaffUserMapper.toDomain(orm) : null;
  }

  async findByPublicId(publicId: string): Promise<StaffUser | null> {
    const orm = await this.repository.findOneBy({ publicId });
    return orm ? StaffUserMapper.toDomain(orm) : null;
  }

  async findByLogin(login: string): Promise<StaffUser | null> {
    const orm = await this.repository.findOneBy({ login });
    return orm ? StaffUserMapper.toDomain(orm) : null;
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<StaffUser>> {
    const [orms, total] = await this.repository.findAndCount({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });
    return {
      items: orms.map(StaffUserMapper.toDomain),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async save(staffUser: StaffUser): Promise<StaffUser> {
    const orm = await this.repository.save(StaffUserMapper.toPersistence(staffUser));
    return StaffUserMapper.toDomain(orm);
  }
}

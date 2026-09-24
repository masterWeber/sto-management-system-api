import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { StaffRepository } from '../domain/staff-repository.port.js';
import { StaffUser } from '../domain/staff-user.entity.js';
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

  async findByLogin(login: string): Promise<StaffUser | null> {
    const orm = await this.repository.findOneBy({ login });
    return orm ? StaffUserMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<StaffUser[]> {
    const orms = await this.repository.find();
    return orms.map(StaffUserMapper.toDomain);
  }

  async save(staffUser: StaffUser): Promise<StaffUser> {
    const orm = await this.repository.save(StaffUserMapper.toPersistence(staffUser));
    return StaffUserMapper.toDomain(orm);
  }
}

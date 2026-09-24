import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import type {
  ClientRepository,
  ClientSearchFilters,
} from '../domain/client-repository.port.js';
import { Client } from '../domain/client.entity.js';
import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import { ConflictError } from '../../shared/domain/errors/domain-error.js';
import { ClientMapper } from './persistence/client.mapper.js';
import { ClientOrmEntity } from './persistence/client.orm-entity.js';

const POSTGRES_FOREIGN_KEY_VIOLATION = '23503';

@Injectable()
export class TypeOrmClientRepository implements ClientRepository {
  constructor(
    @InjectRepository(ClientOrmEntity)
    private readonly repository: Repository<ClientOrmEntity>,
  ) {}

  async findById(id: number): Promise<Client | null> {
    const orm = await this.repository.findOneBy({ id });
    return orm ? ClientMapper.toDomain(orm) : null;
  }

  async findByPublicId(publicId: string): Promise<Client | null> {
    const orm = await this.repository.findOneBy({ publicId });
    return orm ? ClientMapper.toDomain(orm) : null;
  }

  async findAll(
    filters: ClientSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Client>> {
    const query = this.repository.createQueryBuilder('client');
    if (filters.search) {
      query.andWhere(
        '(client.firstName ILIKE :search OR client.lastName ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }
    if (filters.phone) {
      query.andWhere('client.phone ILIKE :phone', { phone: `%${filters.phone}%` });
    }
    const [orms, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();
    return {
      items: orms.map(ClientMapper.toDomain),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async save(client: Client): Promise<Client> {
    const orm = await this.repository.save(ClientMapper.toPersistence(client));
    return ClientMapper.toDomain(orm);
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === POSTGRES_FOREIGN_KEY_VIOLATION
      ) {
        throw new ConflictError('Client has associated records and cannot be deleted');
      }
      throw error;
    }
  }
}

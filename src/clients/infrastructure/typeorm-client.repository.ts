import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  ClientRepository,
  ClientSearchFilters,
} from '../domain/client-repository.port.js';
import { Client } from '../domain/client.entity.js';
import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import { deleteOrThrowConflict } from '../../shared/infrastructure/delete-or-throw-conflict.js';
import { ClientMapper } from './persistence/client.mapper.js';
import { ClientOrmEntity } from './persistence/client.orm-entity.js';

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
    await deleteOrThrowConflict(
      () => this.repository.delete(id),
      'Client has associated records and cannot be deleted',
    );
  }
}

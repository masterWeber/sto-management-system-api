import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResult, PaginationParams } from '../../../shared/domain/pagination.js';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
  type ClientSearchFilters,
} from '../../domain/client-repository.port.js';
import { Client } from '../../domain/client.entity.js';

@Injectable()
export class ListClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
  ) {}

  async execute(
    filters: ClientSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Client>> {
    return this.clientRepository.findAll(filters, pagination);
  }
}

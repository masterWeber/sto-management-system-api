import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { Client } from '../../domain/client.entity.js';
import { ClientResponseDto } from './client.response.dto.js';

export class ClientsPageResponseDto {
  items: ClientResponseDto[];
  total: number;
  page: number;
  limit: number;

  private constructor(result: PaginatedResult<Client>) {
    this.items = result.items.map(ClientResponseDto.fromDomain);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }

  static fromDomain(result: PaginatedResult<Client>): ClientsPageResponseDto {
    return new ClientsPageResponseDto(result);
  }
}

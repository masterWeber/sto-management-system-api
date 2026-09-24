import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../../clients/domain/client-repository.port.js';
import type { PaginatedResult, PaginationParams } from '../../../shared/domain/pagination.js';
import { CAR_REPOSITORY, type CarRepository } from '../../domain/car-repository.port.js';
import type { CarView } from '../car-view.js';

export interface ListCarsFilters {
  licensePlate?: string;
  clientId?: string;
}

@Injectable()
export class ListCarsUseCase {
  constructor(
    @Inject(CAR_REPOSITORY) private readonly carRepository: CarRepository,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
  ) {}

  async execute(
    filters: ListCarsFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<CarView>> {
    let clientId: number | undefined;
    if (filters.clientId !== undefined) {
      const client = await this.clientRepository.findByPublicId(filters.clientId);
      if (!client) {
        return { items: [], total: 0, page: pagination.page, limit: pagination.limit };
      }
      clientId = client.id!;
    }

    const result = await this.carRepository.findAll(
      { licensePlate: filters.licensePlate, clientId },
      pagination,
    );

    // ponytail: one lookup per distinct client on the page (bounded by page size <=100), not a join —
    // upgrade to a query-builder join if car lists grow large enough for this to matter.
    const uniqueClientIds = [...new Set(result.items.map((car) => car.clientId))];
    const clients = await Promise.all(
      uniqueClientIds.map((id) => this.clientRepository.findById(id)),
    );
    const publicIdByClientId = new Map(
      clients.map((client, index) => [uniqueClientIds[index], client!.publicId]),
    );

    return {
      ...result,
      items: result.items.map((car) => ({
        car,
        clientPublicId: publicIdByClientId.get(car.clientId)!,
      })),
    };
  }
}

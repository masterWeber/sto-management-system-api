import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../../clients/domain/client-repository.port.js';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { CAR_REPOSITORY, type CarRepository } from '../../domain/car-repository.port.js';
import { Car } from '../../domain/car.entity.js';
import type { CarView } from '../car-view.js';

export interface CreateCarInput {
  make: string;
  year: number;
  licensePlate: string;
  vin?: string;
  clientId: string;
}

@Injectable()
export class CreateCarUseCase {
  constructor(
    @Inject(CAR_REPOSITORY) private readonly carRepository: CarRepository,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: CreateCarInput): Promise<CarView> {
    const client = await this.clientRepository.findByPublicId(input.clientId);
    if (!client) throw new NotFoundError('Client', input.clientId);

    const car = new Car(
      undefined,
      input.make,
      input.year,
      input.licensePlate,
      input.vin,
      client.id!,
    );
    const saved = await this.carRepository.save(car);
    return { car: saved, clientPublicId: client.publicId };
  }
}

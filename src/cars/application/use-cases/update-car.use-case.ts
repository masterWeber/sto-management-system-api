import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../../clients/domain/client-repository.port.js';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { CAR_REPOSITORY, type CarRepository } from '../../domain/car-repository.port.js';
import type { CarView } from '../car-view.js';

export interface UpdateCarInput {
  make?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
}

@Injectable()
export class UpdateCarUseCase {
  constructor(
    @Inject(CAR_REPOSITORY) private readonly carRepository: CarRepository,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
  ) {}

  async execute(publicId: string, input: UpdateCarInput): Promise<CarView> {
    const car = await this.carRepository.findByPublicId(publicId);
    if (!car) throw new NotFoundError('Car', publicId);
    car.update(input);
    const saved = await this.carRepository.save(car);
    const client = await this.clientRepository.findById(saved.clientId);
    return { car: saved, clientPublicId: client!.publicId };
  }
}

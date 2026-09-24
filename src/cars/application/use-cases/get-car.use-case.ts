import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../../clients/domain/client-repository.port.js';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { CAR_REPOSITORY, type CarRepository } from '../../domain/car-repository.port.js';
import type { CarView } from '../car-view.js';

@Injectable()
export class GetCarUseCase {
  constructor(
    @Inject(CAR_REPOSITORY) private readonly carRepository: CarRepository,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
  ) {}

  async execute(publicId: string): Promise<CarView> {
    const car = await this.carRepository.findByPublicId(publicId);
    if (!car) throw new NotFoundError('Car', publicId);
    const client = await this.clientRepository.findById(car.clientId);
    return { car, clientPublicId: client!.publicId };
  }
}

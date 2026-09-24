import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { CAR_REPOSITORY, type CarRepository } from '../../domain/car-repository.port.js';

@Injectable()
export class DeleteCarUseCase {
  constructor(@Inject(CAR_REPOSITORY) private readonly carRepository: CarRepository) {}

  async execute(publicId: string): Promise<void> {
    const car = await this.carRepository.findByPublicId(publicId);
    if (!car) throw new NotFoundError('Car', publicId);
    await this.carRepository.delete(car.id!);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { SERVICE_REPOSITORY, type ServiceRepository } from '../../domain/service-repository.port.js';

@Injectable()
export class DeleteServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository,
  ) {}

  async execute(publicId: string): Promise<void> {
    const service = await this.serviceRepository.findByPublicId(publicId);
    if (!service) throw new NotFoundError('Service', publicId);
    await this.serviceRepository.delete(service.id!);
  }
}

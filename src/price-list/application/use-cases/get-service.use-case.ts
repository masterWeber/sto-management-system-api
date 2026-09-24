import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  SERVICE_CATEGORY_REPOSITORY,
  type ServiceCategoryRepository,
} from '../../domain/service-category-repository.port.js';
import { SERVICE_REPOSITORY, type ServiceRepository } from '../../domain/service-repository.port.js';
import type { ServiceView } from '../service-view.js';

@Injectable()
export class GetServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository,
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ServiceCategoryRepository,
  ) {}

  async execute(publicId: string): Promise<ServiceView> {
    const service = await this.serviceRepository.findByPublicId(publicId);
    if (!service) throw new NotFoundError('Service', publicId);
    const category = await this.categoryRepository.findById(service.categoryId);
    return { service, categoryPublicId: category!.publicId };
  }
}

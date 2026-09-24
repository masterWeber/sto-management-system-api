import { Inject, Injectable } from '@nestjs/common';
import { Money } from '../../../shared/domain/money.vo.js';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  SERVICE_CATEGORY_REPOSITORY,
  type ServiceCategoryRepository,
} from '../../domain/service-category-repository.port.js';
import { SERVICE_REPOSITORY, type ServiceRepository } from '../../domain/service-repository.port.js';
import type { ServiceView } from '../service-view.js';

export interface UpdateServiceInput {
  name?: string;
  priceKopecks?: number;
}

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository,
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ServiceCategoryRepository,
  ) {}

  async execute(publicId: string, input: UpdateServiceInput): Promise<ServiceView> {
    const service = await this.serviceRepository.findByPublicId(publicId);
    if (!service) throw new NotFoundError('Service', publicId);
    service.update({
      name: input.name,
      price: input.priceKopecks !== undefined ? Money.ofKopecks(input.priceKopecks) : undefined,
    });
    const saved = await this.serviceRepository.save(service);
    const category = await this.categoryRepository.findById(saved.categoryId);
    return { service: saved, categoryPublicId: category!.publicId };
  }
}

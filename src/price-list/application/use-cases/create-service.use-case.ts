import { Inject, Injectable } from '@nestjs/common';
import { Money } from '../../../shared/domain/money.vo.js';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  SERVICE_CATEGORY_REPOSITORY,
  type ServiceCategoryRepository,
} from '../../domain/service-category-repository.port.js';
import { SERVICE_REPOSITORY, type ServiceRepository } from '../../domain/service-repository.port.js';
import { Service } from '../../domain/service.entity.js';
import type { ServiceView } from '../service-view.js';

export interface CreateServiceInput {
  name: string;
  priceKopecks: number;
  categoryId: string;
}

@Injectable()
export class CreateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository,
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ServiceCategoryRepository,
  ) {}

  async execute(input: CreateServiceInput): Promise<ServiceView> {
    const category = await this.categoryRepository.findByPublicId(input.categoryId);
    if (!category) throw new NotFoundError('ServiceCategory', input.categoryId);

    const service = new Service(
      undefined,
      input.name,
      Money.ofKopecks(input.priceKopecks),
      category.id!,
    );
    const saved = await this.serviceRepository.save(service);
    return { service: saved, categoryPublicId: category.publicId };
  }
}

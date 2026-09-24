import { Inject, Injectable } from '@nestjs/common';
import {
  SERVICE_CATEGORY_REPOSITORY,
  type ServiceCategoryRepository,
} from '../../domain/service-category-repository.port.js';
import { ServiceCategory } from '../../domain/service-category.entity.js';

export interface CreateServiceCategoryInput {
  name: string;
}

@Injectable()
export class CreateServiceCategoryUseCase {
  constructor(
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ServiceCategoryRepository,
  ) {}

  async execute(input: CreateServiceCategoryInput): Promise<ServiceCategory> {
    const category = new ServiceCategory(undefined, input.name);
    return this.categoryRepository.save(category);
  }
}

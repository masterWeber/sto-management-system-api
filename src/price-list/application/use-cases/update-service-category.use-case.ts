import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  SERVICE_CATEGORY_REPOSITORY,
  type ServiceCategoryRepository,
} from '../../domain/service-category-repository.port.js';
import { ServiceCategory } from '../../domain/service-category.entity.js';

@Injectable()
export class UpdateServiceCategoryUseCase {
  constructor(
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ServiceCategoryRepository,
  ) {}

  async execute(publicId: string, name: string): Promise<ServiceCategory> {
    const category = await this.categoryRepository.findByPublicId(publicId);
    if (!category) throw new NotFoundError('ServiceCategory', publicId);
    category.rename(name);
    return this.categoryRepository.save(category);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  SERVICE_CATEGORY_REPOSITORY,
  type ServiceCategoryRepository,
} from '../../domain/service-category-repository.port.js';

@Injectable()
export class DeleteServiceCategoryUseCase {
  constructor(
    @Inject(SERVICE_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ServiceCategoryRepository,
  ) {}

  async execute(publicId: string): Promise<void> {
    const category = await this.categoryRepository.findByPublicId(publicId);
    if (!category) throw new NotFoundError('ServiceCategory', publicId);
    await this.categoryRepository.delete(category.id!);
  }
}

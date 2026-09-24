import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  PRODUCT_CATEGORY_REPOSITORY,
  type ProductCategoryRepository,
} from '../../domain/product-category-repository.port.js';
import { ProductCategory } from '../../domain/product-category.entity.js';

@Injectable()
export class UpdateProductCategoryUseCase {
  constructor(
    @Inject(PRODUCT_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ProductCategoryRepository,
  ) {}

  async execute(publicId: string, name: string): Promise<ProductCategory> {
    const category = await this.categoryRepository.findByPublicId(publicId);
    if (!category) throw new NotFoundError('ProductCategory', publicId);
    category.rename(name);
    return this.categoryRepository.save(category);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  PRODUCT_CATEGORY_REPOSITORY,
  type ProductCategoryRepository,
} from '../../domain/product-category-repository.port.js';
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../domain/product-repository.port.js';
import type { ProductView } from '../product-view.js';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    @Inject(PRODUCT_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ProductCategoryRepository,
  ) {}

  async execute(publicId: string): Promise<ProductView> {
    const product = await this.productRepository.findByPublicId(publicId);
    if (!product) throw new NotFoundError('Product', publicId);
    const category = await this.categoryRepository.findById(product.categoryId);
    return { product, categoryPublicId: category!.publicId };
  }
}

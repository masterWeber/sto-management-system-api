import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  PRODUCT_CATEGORY_REPOSITORY,
  type ProductCategoryRepository,
} from '../../domain/product-category-repository.port.js';
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../domain/product-repository.port.js';
import type { ProductView } from '../product-view.js';

export interface UpdateProductInput {
  name?: string;
  sku?: string;
  quantity?: number;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    @Inject(PRODUCT_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ProductCategoryRepository,
  ) {}

  async execute(publicId: string, input: UpdateProductInput): Promise<ProductView> {
    const product = await this.productRepository.findByPublicId(publicId);
    if (!product) throw new NotFoundError('Product', publicId);
    product.update(input);
    const saved = await this.productRepository.save(product);
    const category = await this.categoryRepository.findById(saved.categoryId);
    return { product: saved, categoryPublicId: category!.publicId };
  }
}

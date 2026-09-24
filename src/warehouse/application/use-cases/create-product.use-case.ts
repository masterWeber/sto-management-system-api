import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  PRODUCT_CATEGORY_REPOSITORY,
  type ProductCategoryRepository,
} from '../../domain/product-category-repository.port.js';
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../domain/product-repository.port.js';
import { Product } from '../../domain/product.entity.js';
import type { ProductView } from '../product-view.js';

export interface CreateProductInput {
  name: string;
  sku: string;
  quantity: number;
  categoryId: string;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    @Inject(PRODUCT_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ProductCategoryRepository,
  ) {}

  async execute(input: CreateProductInput): Promise<ProductView> {
    const category = await this.categoryRepository.findByPublicId(input.categoryId);
    if (!category) throw new NotFoundError('ProductCategory', input.categoryId);

    const product = new Product(
      undefined,
      input.name,
      input.sku,
      input.quantity,
      category.id!,
    );
    const saved = await this.productRepository.save(product);
    return { product: saved, categoryPublicId: category.publicId };
  }
}

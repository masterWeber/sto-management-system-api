import { Inject, Injectable } from '@nestjs/common';
import {
  PRODUCT_CATEGORY_REPOSITORY,
  type ProductCategoryRepository,
} from '../../domain/product-category-repository.port.js';
import { ProductCategory } from '../../domain/product-category.entity.js';

export interface CreateProductCategoryInput {
  name: string;
}

@Injectable()
export class CreateProductCategoryUseCase {
  constructor(
    @Inject(PRODUCT_CATEGORY_REPOSITORY)
    private readonly categoryRepository: ProductCategoryRepository,
  ) {}

  async execute(input: CreateProductCategoryInput): Promise<ProductCategory> {
    const category = new ProductCategory(undefined, input.name);
    return this.categoryRepository.save(category);
  }
}

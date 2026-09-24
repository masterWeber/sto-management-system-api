import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { PRODUCT_REPOSITORY, type ProductRepository } from '../../domain/product-repository.port.js';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
  ) {}

  async execute(publicId: string): Promise<void> {
    const product = await this.productRepository.findByPublicId(publicId);
    if (!product) throw new NotFoundError('Product', publicId);
    await this.productRepository.delete(product.id!);
  }
}

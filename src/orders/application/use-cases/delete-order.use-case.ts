import { Inject, Injectable } from '@nestjs/common';
import { ConflictError, NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/order-repository.port.js';

@Injectable()
export class DeleteOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async execute(publicId: string): Promise<void> {
    const order = await this.orderRepository.findByPublicId(publicId);
    if (!order) throw new NotFoundError('Order', publicId);
    if (order.status !== 'RECEIVED') {
      throw new ConflictError('Only orders in RECEIVED status can be deleted');
    }
    await this.orderRepository.delete(order.id!);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/order-repository.port.js';

@Injectable()
export class RemoveOrderItemUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async execute(orderPublicId: string, itemPublicId: string): Promise<void> {
    const order = await this.orderRepository.findByPublicId(orderPublicId);
    if (!order) throw new NotFoundError('Order', orderPublicId);
    order.removeItem(itemPublicId);
    await this.orderRepository.save(order);
  }
}

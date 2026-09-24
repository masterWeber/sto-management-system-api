import { Inject, Injectable } from '@nestjs/common';
import {
  SERVICE_REPOSITORY,
  type ServiceRepository,
} from '../../../price-list/domain/service-repository.port.js';
import { Money } from '../../../shared/domain/money.vo.js';
import { NotFoundError, ValidationError } from '../../../shared/domain/errors/domain-error.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../../staff/domain/staff-repository.port.js';
import { assertOrderVisibleTo } from '../assert-order-visible-to.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/order-repository.port.js';
import { OrderItem } from '../../domain/order-item.entity.js';
import type { RequestingStaff } from '../requesting-staff.js';

export interface AddOrderItemInput {
  serviceId?: string;
  name?: string;
  priceKopecks?: number;
}

@Injectable()
export class AddOrderItemUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(SERVICE_REPOSITORY) private readonly serviceRepository: ServiceRepository,
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
  ) {}

  async execute(
    orderPublicId: string,
    input: AddOrderItemInput,
    requester: RequestingStaff,
  ): Promise<OrderItem> {
    const order = await this.orderRepository.findByPublicId(orderPublicId);
    if (!order) throw new NotFoundError('Order', orderPublicId);
    await assertOrderVisibleTo(order, requester, this.staffRepository);

    let name: string;
    let price: Money;
    let serviceId: number | undefined;

    if (input.serviceId !== undefined) {
      const service = await this.serviceRepository.findByPublicId(input.serviceId);
      if (!service) throw new NotFoundError('Service', input.serviceId);
      serviceId = service.id!;
      name = service.name;
      price = service.price;
    } else {
      if (!input.name || input.priceKopecks === undefined) {
        throw new ValidationError('Either serviceId or both name and priceKopecks are required');
      }
      name = input.name;
      price = Money.ofKopecks(input.priceKopecks);
    }

    const item = order.addItem({ serviceId, name, price });
    await this.orderRepository.save(order);
    return item;
  }
}

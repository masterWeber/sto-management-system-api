import { Inject, Injectable } from '@nestjs/common';
import {
  DOMAIN_EVENT_PUBLISHER,
  type DomainEventPublisher,
} from '../../../shared/application/ports/domain-event-publisher.port.js';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { Role } from '../../../shared/domain/role.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../../staff/domain/staff-repository.port.js';
import { assertOrderVisibleTo } from '../assert-order-visible-to.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/order-repository.port.js';
import type { OrderStatus } from '../../domain/order-status.js';
import type { RequestingStaff } from '../requesting-staff.js';

@Injectable()
export class TransitionOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
    @Inject(DOMAIN_EVENT_PUBLISHER) private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(publicId: string, target: OrderStatus, requester: RequestingStaff): Promise<void> {
    const order = await this.orderRepository.findByPublicId(publicId);
    if (!order) throw new NotFoundError('Order', publicId);
    await assertOrderVisibleTo(order, requester, this.staffRepository);

    order.transitionTo(target, { adminOverride: requester.role === Role.ADMIN });
    await this.orderRepository.save(order);

    for (const event of order.pullDomainEvents()) {
      this.eventPublisher.publish(event);
    }
  }
}

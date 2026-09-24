import { Inject, Injectable } from '@nestjs/common';
import { CAR_REPOSITORY, type CarRepository } from '../../../cars/domain/car-repository.port.js';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../../clients/domain/client-repository.port.js';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../../staff/domain/staff-repository.port.js';
import { assertOrderVisibleTo } from '../assert-order-visible-to.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/order-repository.port.js';
import type { OrderView } from '../order-view.js';
import type { RequestingStaff } from '../requesting-staff.js';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
    @Inject(CAR_REPOSITORY) private readonly carRepository: CarRepository,
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
  ) {}

  async execute(publicId: string, requester: RequestingStaff): Promise<OrderView> {
    const order = await this.orderRepository.findByPublicId(publicId);
    if (!order) throw new NotFoundError('Order', publicId);
    await assertOrderVisibleTo(order, requester, this.staffRepository);

    const [client, car, master] = await Promise.all([
      this.clientRepository.findById(order.clientId),
      this.carRepository.findById(order.carId),
      order.assignedMasterId !== undefined
        ? this.staffRepository.findById(order.assignedMasterId)
        : Promise.resolve(null),
    ]);

    return {
      order,
      clientPublicId: client!.publicId,
      carPublicId: car!.publicId,
      assignedMasterPublicId: master?.publicId ?? null,
    };
  }
}

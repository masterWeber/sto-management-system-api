import { Inject, Injectable } from '@nestjs/common';
import { CAR_REPOSITORY, type CarRepository } from '../../../cars/domain/car-repository.port.js';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../../clients/domain/client-repository.port.js';
import { NotFoundError, ValidationError } from '../../../shared/domain/errors/domain-error.js';
import { Role } from '../../../shared/domain/role.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../../staff/domain/staff-repository.port.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/order-repository.port.js';
import type { OrderView } from '../order-view.js';

export interface UpdateOrderInput {
  scheduledAt?: Date;
  comment?: string;
  assignedMasterId?: string | null;
}

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
    @Inject(CAR_REPOSITORY) private readonly carRepository: CarRepository,
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
  ) {}

  async execute(publicId: string, input: UpdateOrderInput): Promise<OrderView> {
    const order = await this.orderRepository.findByPublicId(publicId);
    if (!order) throw new NotFoundError('Order', publicId);

    order.updateDetails({ scheduledAt: input.scheduledAt, comment: input.comment });

    let masterPublicId: string | null = null;
    if (input.assignedMasterId === null) {
      order.assignMaster(undefined);
    } else if (input.assignedMasterId !== undefined) {
      const master = await this.staffRepository.findByPublicId(input.assignedMasterId);
      if (!master) throw new NotFoundError('StaffUser', input.assignedMasterId);
      if (master.role !== Role.MASTER) {
        throw new ValidationError('Only staff with the MASTER role can be assigned to orders');
      }
      order.assignMaster(master.id!);
      masterPublicId = master.publicId;
    } else if (order.assignedMasterId !== undefined) {
      const master = await this.staffRepository.findById(order.assignedMasterId);
      masterPublicId = master?.publicId ?? null;
    }

    const saved = await this.orderRepository.save(order);
    const [client, car] = await Promise.all([
      this.clientRepository.findById(saved.clientId),
      this.carRepository.findById(saved.carId),
    ]);

    return {
      order: saved,
      clientPublicId: client!.publicId,
      carPublicId: car!.publicId,
      assignedMasterPublicId: masterPublicId,
    };
  }
}

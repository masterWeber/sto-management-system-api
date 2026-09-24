import { Inject, Injectable } from '@nestjs/common';
import { CAR_REPOSITORY, type CarRepository } from '../../../cars/domain/car-repository.port.js';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../../clients/domain/client-repository.port.js';
import { NotFoundError, ValidationError } from '../../../shared/domain/errors/domain-error.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/order-repository.port.js';
import { Order } from '../../domain/order.entity.js';
import type { OrderView } from '../order-view.js';

export interface CreateOrderInput {
  clientId: string;
  carId: string;
  scheduledAt: Date;
  comment?: string;
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
    @Inject(CAR_REPOSITORY) private readonly carRepository: CarRepository,
  ) {}

  async execute(input: CreateOrderInput): Promise<OrderView> {
    const client = await this.clientRepository.findByPublicId(input.clientId);
    if (!client) throw new NotFoundError('Client', input.clientId);

    const car = await this.carRepository.findByPublicId(input.carId);
    if (!car) throw new NotFoundError('Car', input.carId);
    if (car.clientId !== client.id) {
      throw new ValidationError('The car does not belong to the specified client');
    }

    const order = new Order(
      undefined,
      client.id!,
      car.id!,
      input.scheduledAt,
      undefined,
      input.comment,
    );
    const saved = await this.orderRepository.save(order);
    return {
      order: saved,
      clientPublicId: client.publicId,
      carPublicId: car.publicId,
      assignedMasterPublicId: null,
    };
  }
}

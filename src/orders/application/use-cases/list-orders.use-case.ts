import { Inject, Injectable } from '@nestjs/common';
import { CAR_REPOSITORY, type CarRepository } from '../../../cars/domain/car-repository.port.js';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../../clients/domain/client-repository.port.js';
import type { PaginatedResult, PaginationParams } from '../../../shared/domain/pagination.js';
import { Role } from '../../../shared/domain/role.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../../staff/domain/staff-repository.port.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/order-repository.port.js';
import type { OrderStatus } from '../../domain/order-status.js';
import type { OrderView } from '../order-view.js';
import type { RequestingStaff } from '../requesting-staff.js';

export interface ListOrdersFilters {
  status?: OrderStatus;
  clientId?: string;
  carId?: string;
  assignedMasterId?: string;
  scheduledFrom?: Date;
  scheduledTo?: Date;
}

const EMPTY_PAGE = (pagination: PaginationParams): PaginatedResult<OrderView> => ({
  items: [],
  total: 0,
  page: pagination.page,
  limit: pagination.limit,
});

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
    @Inject(CAR_REPOSITORY) private readonly carRepository: CarRepository,
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
  ) {}

  async execute(
    filters: ListOrdersFilters,
    pagination: PaginationParams,
    requester: RequestingStaff,
  ): Promise<PaginatedResult<OrderView>> {
    let clientId: number | undefined;
    if (filters.clientId !== undefined) {
      const client = await this.clientRepository.findByPublicId(filters.clientId);
      if (!client) return EMPTY_PAGE(pagination);
      clientId = client.id!;
    }

    let carId: number | undefined;
    if (filters.carId !== undefined) {
      const car = await this.carRepository.findByPublicId(filters.carId);
      if (!car) return EMPTY_PAGE(pagination);
      carId = car.id!;
    }

    let assignedMasterId: number | undefined;
    if (requester.role === Role.MASTER) {
      const requesterStaff = await this.staffRepository.findByPublicId(requester.staffPublicId);
      if (!requesterStaff) return EMPTY_PAGE(pagination);
      assignedMasterId = requesterStaff.id!;
    } else if (filters.assignedMasterId !== undefined) {
      const master = await this.staffRepository.findByPublicId(filters.assignedMasterId);
      if (!master) return EMPTY_PAGE(pagination);
      assignedMasterId = master.id!;
    }

    const result = await this.orderRepository.findAll(
      {
        status: filters.status,
        clientId,
        carId,
        assignedMasterId,
        scheduledFrom: filters.scheduledFrom,
        scheduledTo: filters.scheduledTo,
      },
      pagination,
    );

    // ponytail: one lookup per distinct client/car/master on the page (bounded by page size <=100),
    // not a join — upgrade to a query-builder join if the orders list grows large enough to matter.
    const clientIds = [...new Set(result.items.map((order) => order.clientId))];
    const carIds = [...new Set(result.items.map((order) => order.carId))];
    const masterIds = [
      ...new Set(
        result.items
          .map((order) => order.assignedMasterId)
          .filter((id): id is number => id !== undefined),
      ),
    ];

    const [clients, cars, masters] = await Promise.all([
      Promise.all(clientIds.map((id) => this.clientRepository.findById(id))),
      Promise.all(carIds.map((id) => this.carRepository.findById(id))),
      Promise.all(masterIds.map((id) => this.staffRepository.findById(id))),
    ]);

    const clientPublicIdById = new Map(clients.map((c, i) => [clientIds[i], c!.publicId]));
    const carPublicIdById = new Map(cars.map((c, i) => [carIds[i], c!.publicId]));
    const masterPublicIdById = new Map(masters.map((m, i) => [masterIds[i], m!.publicId]));

    return {
      ...result,
      items: result.items.map((order) => ({
        order,
        clientPublicId: clientPublicIdById.get(order.clientId)!,
        carPublicId: carPublicIdById.get(order.carId)!,
        assignedMasterPublicId:
          order.assignedMasterId !== undefined
            ? (masterPublicIdById.get(order.assignedMasterId) ?? null)
            : null,
      })),
    };
  }
}

import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { Order } from './order.entity.js';
import type { OrderStatus } from './order-status.js';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderSearchFilters {
  status?: OrderStatus;
  clientId?: number;
  carId?: number;
  assignedMasterId?: number;
  scheduledFrom?: Date;
  scheduledTo?: Date;
}

export interface OrderRepository {
  findById(id: number): Promise<Order | null>;
  findByPublicId(publicId: string): Promise<Order | null>;
  findAll(
    filters: OrderSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Order>>;
  save(order: Order): Promise<Order>;
  delete(id: number): Promise<void>;
}

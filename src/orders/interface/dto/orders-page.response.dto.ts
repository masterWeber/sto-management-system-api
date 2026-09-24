import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { OrderView } from '../../application/order-view.js';
import { OrderResponseDto } from './order.response.dto.js';

export class OrdersPageResponseDto {
  items: OrderResponseDto[];
  total: number;
  page: number;
  limit: number;

  private constructor(result: PaginatedResult<OrderView>) {
    this.items = result.items.map(OrderResponseDto.fromView);
    this.total = result.total;
    this.page = result.page;
    this.limit = result.limit;
  }

  static fromDomain(result: PaginatedResult<OrderView>): OrdersPageResponseDto {
    return new OrdersPageResponseDto(result);
  }
}

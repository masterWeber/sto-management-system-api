import type { OrderView } from '../../application/order-view.js';
import type { OrderStatus } from '../../domain/order-status.js';
import { OrderItemResponseDto } from './order-item.response.dto.js';

export class OrderResponseDto {
  id: string;
  clientId: string;
  carId: string;
  scheduledAt: Date;
  status: OrderStatus;
  comment: string | null;
  assignedMasterId: string | null;
  completedAt: Date | null;
  paidAt: Date | null;
  items: OrderItemResponseDto[];
  totalKopecks: number;

  private constructor(view: OrderView) {
    this.id = view.order.publicId;
    this.clientId = view.clientPublicId;
    this.carId = view.carPublicId;
    this.scheduledAt = view.order.scheduledAt;
    this.status = view.order.status;
    this.comment = view.order.comment ?? null;
    this.assignedMasterId = view.assignedMasterPublicId;
    this.completedAt = view.order.completedAt ?? null;
    this.paidAt = view.order.paidAt ?? null;
    this.items = view.order.items.map(OrderItemResponseDto.fromDomain);
    this.totalKopecks = view.order.total().toKopecks();
  }

  static fromView(view: OrderView): OrderResponseDto {
    return new OrderResponseDto(view);
  }
}

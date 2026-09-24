import type { OrderItem } from '../../domain/order-item.entity.js';

export class OrderItemResponseDto {
  id: string;
  name: string;
  priceKopecks: number;

  private constructor(item: OrderItem) {
    this.id = item.publicId;
    this.name = item.name;
    this.priceKopecks = item.price.toKopecks();
  }

  static fromDomain(item: OrderItem): OrderItemResponseDto {
    return new OrderItemResponseDto(item);
  }
}

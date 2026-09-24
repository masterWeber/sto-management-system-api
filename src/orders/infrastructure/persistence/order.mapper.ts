import { Order } from '../../domain/order.entity.js';
import { OrderItemMapper } from './order-item.mapper.js';
import type { OrderItemOrmEntity } from './order-item.orm-entity.js';
import { OrderOrmEntity } from './order.orm-entity.js';

export class OrderMapper {
  static toDomain(orm: OrderOrmEntity, items: OrderItemOrmEntity[]): Order {
    return new Order(
      orm.id,
      orm.clientId,
      orm.carId,
      orm.scheduledAt,
      orm.status,
      orm.comment ?? undefined,
      orm.assignedMasterId ?? undefined,
      orm.completedAt ?? undefined,
      orm.paidAt ?? undefined,
      items.map(OrderItemMapper.toDomain),
      orm.publicId,
    );
  }

  static toPersistence(order: Order): OrderOrmEntity {
    const orm = new OrderOrmEntity();
    if (order.id !== undefined) orm.id = order.id;
    orm.publicId = order.publicId;
    orm.clientId = order.clientId;
    orm.carId = order.carId;
    orm.scheduledAt = order.scheduledAt;
    orm.status = order.status;
    orm.comment = order.comment;
    orm.assignedMasterId = order.assignedMasterId;
    orm.completedAt = order.completedAt;
    orm.paidAt = order.paidAt;
    return orm;
  }
}

import { Money } from '../../../shared/domain/money.vo.js';
import { OrderItem } from '../../domain/order-item.entity.js';
import { OrderItemOrmEntity } from './order-item.orm-entity.js';

export class OrderItemMapper {
  static toDomain(orm: OrderItemOrmEntity): OrderItem {
    return new OrderItem(
      orm.id,
      orm.serviceId ?? undefined,
      orm.name,
      Money.ofKopecks(orm.priceKopecks),
      orm.publicId,
    );
  }

  // Order.save() always deletes and re-inserts the item rows for the order
  // (see TypeOrmOrderRepository), so the persistence row is always a fresh
  // insert — never carries the domain item's internal id.
  static toPersistence(item: OrderItem): OrderItemOrmEntity {
    const orm = new OrderItemOrmEntity();
    orm.publicId = item.publicId;
    orm.serviceId = item.serviceId;
    orm.name = item.name;
    orm.priceKopecks = item.price.toKopecks();
    return orm;
  }
}

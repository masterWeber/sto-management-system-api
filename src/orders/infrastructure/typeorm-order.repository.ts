import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { PaginatedResult, PaginationParams } from '../../shared/domain/pagination.js';
import type { OrderRepository, OrderSearchFilters } from '../domain/order-repository.port.js';
import { Order } from '../domain/order.entity.js';
import { OrderItemMapper } from './persistence/order-item.mapper.js';
import { OrderItemOrmEntity } from './persistence/order-item.orm-entity.js';
import { OrderMapper } from './persistence/order.mapper.js';
import { OrderOrmEntity } from './persistence/order.orm-entity.js';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly repository: Repository<OrderOrmEntity>,
    @InjectRepository(OrderItemOrmEntity)
    private readonly itemRepository: Repository<OrderItemOrmEntity>,
  ) {}

  async findById(id: number): Promise<Order | null> {
    const orm = await this.repository.findOneBy({ id });
    if (!orm) return null;
    const items = await this.itemRepository.findBy({ orderId: id });
    return OrderMapper.toDomain(orm, items);
  }

  async findByPublicId(publicId: string): Promise<Order | null> {
    const orm = await this.repository.findOneBy({ publicId });
    if (!orm) return null;
    const items = await this.itemRepository.findBy({ orderId: orm.id });
    return OrderMapper.toDomain(orm, items);
  }

  async findAll(
    filters: OrderSearchFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Order>> {
    const query = this.repository.createQueryBuilder('order');

    if (filters.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }
    if (filters.clientId !== undefined) {
      query.andWhere('order.clientId = :clientId', { clientId: filters.clientId });
    }
    if (filters.carId !== undefined) {
      query.andWhere('order.carId = :carId', { carId: filters.carId });
    }
    if (filters.assignedMasterId !== undefined) {
      query.andWhere('order.assignedMasterId = :assignedMasterId', {
        assignedMasterId: filters.assignedMasterId,
      });
    }
    if (filters.scheduledFrom) {
      query.andWhere('order.scheduledAt >= :scheduledFrom', {
        scheduledFrom: filters.scheduledFrom,
      });
    }
    if (filters.scheduledTo) {
      query.andWhere('order.scheduledAt <= :scheduledTo', { scheduledTo: filters.scheduledTo });
    }

    const [orms, total] = await query
      .orderBy('order.scheduledAt', 'DESC')
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const orderIds = orms.map((orm) => orm.id);
    const allItems =
      orderIds.length > 0 ? await this.itemRepository.findBy({ orderId: In(orderIds) }) : [];
    const itemsByOrderId = new Map<number, OrderItemOrmEntity[]>();
    for (const item of allItems) {
      const list = itemsByOrderId.get(item.orderId) ?? [];
      list.push(item);
      itemsByOrderId.set(item.orderId, list);
    }

    return {
      items: orms.map((orm) => OrderMapper.toDomain(orm, itemsByOrderId.get(orm.id) ?? [])),
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }

  async save(order: Order): Promise<Order> {
    const orm = await this.repository.save(OrderMapper.toPersistence(order));

    await this.itemRepository.delete({ orderId: orm.id });
    if (order.items.length > 0) {
      const itemOrms = order.items.map((item) => {
        const itemOrm = OrderItemMapper.toPersistence(item);
        itemOrm.orderId = orm.id;
        return itemOrm;
      });
      await this.itemRepository.save(itemOrms);
    }

    return this.findById(orm.id) as Promise<Order>;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}

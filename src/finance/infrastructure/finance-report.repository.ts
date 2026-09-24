import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseOrmEntity } from '../../expenses/infrastructure/persistence/expense.orm-entity.js';
import { OrderItemOrmEntity } from '../../orders/infrastructure/persistence/order-item.orm-entity.js';
import { OrderOrmEntity } from '../../orders/infrastructure/persistence/order.orm-entity.js';
import type { FinanceGroupBy } from '../application/finance-summary.js';

export interface RawRecentOrder {
  id: number;
  publicId: string;
  clientId: number;
  scheduledAt: Date;
  status: string;
  totalKopecks: number;
}

export interface RawChartBucket {
  bucket: Date;
  amountKopecks: number;
}

@Injectable()
export class FinanceReportRepository {
  constructor(
    @InjectRepository(OrderOrmEntity) private readonly orderRepo: Repository<OrderOrmEntity>,
    @InjectRepository(OrderItemOrmEntity)
    private readonly orderItemRepo: Repository<OrderItemOrmEntity>,
    @InjectRepository(ExpenseOrmEntity) private readonly expenseRepo: Repository<ExpenseOrmEntity>,
  ) {}

  async getRevenueKopecks(from: Date, to: Date): Promise<number> {
    const { sum } = await this.orderItemRepo
      .createQueryBuilder('item')
      .innerJoin(OrderOrmEntity, 'order', 'order.id = item.orderId')
      .where("order.status = 'PAID'")
      .andWhere('order.paidAt BETWEEN :from AND :to', { from, to })
      .select('COALESCE(SUM(item.priceKopecks), 0)', 'sum')
      .getRawOne();
    return Number(sum);
  }

  async getExpensesKopecks(from: Date, to: Date): Promise<number> {
    const { sum } = await this.expenseRepo
      .createQueryBuilder('expense')
      .where('expense.date BETWEEN :from AND :to', { from, to })
      .select('COALESCE(SUM(expense.amountKopecks), 0)', 'sum')
      .getRawOne();
    return Number(sum);
  }

  async getPaidOrdersCount(from: Date, to: Date): Promise<number> {
    return this.orderRepo
      .createQueryBuilder('order')
      .where("order.status = 'PAID'")
      .andWhere('order.paidAt BETWEEN :from AND :to', { from, to })
      .getCount();
  }

  async getOrdersCount(from: Date, to: Date): Promise<number> {
    return this.orderRepo
      .createQueryBuilder('order')
      .where('order.createdAt BETWEEN :from AND :to', { from, to })
      .getCount();
  }

  async getDistinctClientsCount(from: Date, to: Date): Promise<number> {
    const { count } = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.createdAt BETWEEN :from AND :to', { from, to })
      .select('COUNT(DISTINCT order.clientId)', 'count')
      .getRawOne();
    return Number(count);
  }

  async getRevenueChart(groupBy: FinanceGroupBy, from: Date, to: Date): Promise<RawChartBucket[]> {
    const rows = await this.orderItemRepo
      .createQueryBuilder('item')
      .innerJoin(OrderOrmEntity, 'order', 'order.id = item.orderId')
      .where("order.status = 'PAID'")
      .andWhere('order.paidAt BETWEEN :from AND :to', { from, to })
      .select('date_trunc(:unit, order.paidAt)', 'bucket')
      .addSelect('COALESCE(SUM(item.priceKopecks), 0)', 'amountKopecks')
      .setParameter('unit', groupBy)
      .groupBy('bucket')
      .orderBy('bucket', 'ASC')
      .getRawMany();
    return rows.map((row) => ({ bucket: row.bucket, amountKopecks: Number(row.amountKopecks) }));
  }

  async getExpensesChart(groupBy: FinanceGroupBy, from: Date, to: Date): Promise<RawChartBucket[]> {
    const rows = await this.expenseRepo
      .createQueryBuilder('expense')
      .where('expense.date BETWEEN :from AND :to', { from, to })
      .select('date_trunc(:unit, expense.date)', 'bucket')
      .addSelect('COALESCE(SUM(expense.amountKopecks), 0)', 'amountKopecks')
      .setParameter('unit', groupBy)
      .groupBy('bucket')
      .orderBy('bucket', 'ASC')
      .getRawMany();
    return rows.map((row) => ({ bucket: row.bucket, amountKopecks: Number(row.amountKopecks) }));
  }

  async getRecentOrders(from: Date, to: Date, limit: number): Promise<RawRecentOrder[]> {
    const rows = await this.orderRepo
      .createQueryBuilder('order')
      .leftJoin(OrderItemOrmEntity, 'item', 'item."orderId" = order.id')
      .where('order.createdAt BETWEEN :from AND :to', { from, to })
      .select('order.id', 'id')
      .addSelect('order.publicId', 'publicId')
      .addSelect('order.clientId', 'clientId')
      .addSelect('order.scheduledAt', 'scheduledAt')
      .addSelect('order.status', 'status')
      .addSelect('COALESCE(SUM(item.priceKopecks), 0)', 'totalKopecks')
      .groupBy('order.id')
      .orderBy('order.scheduledAt', 'DESC')
      .limit(limit)
      .getRawMany();
    return rows.map((row) => ({
      id: Number(row.id),
      publicId: row.publicId,
      clientId: Number(row.clientId),
      scheduledAt: row.scheduledAt,
      status: row.status,
      totalKopecks: Number(row.totalKopecks),
    }));
  }
}

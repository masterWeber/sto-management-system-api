import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../clients/domain/client-repository.port.js';
import { FinanceReportRepository } from '../infrastructure/finance-report.repository.js';
import type {
  FinanceChartPoint,
  FinanceGroupBy,
  FinanceRecentOrder,
  FinanceSummary,
} from './finance-summary.js';

const RECENT_ORDERS_LIMIT = 5;

@Injectable()
export class FinanceQueryService {
  constructor(
    private readonly financeReportRepository: FinanceReportRepository,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
  ) {}

  async getSummary(from: Date, to: Date, groupBy: FinanceGroupBy): Promise<FinanceSummary> {
    const [
      revenueKopecks,
      expensesKopecks,
      paidOrdersCount,
      ordersCount,
      clientsCount,
      revenueChart,
      expensesChart,
      recentOrdersRaw,
    ] = await Promise.all([
      this.financeReportRepository.getRevenueKopecks(from, to),
      this.financeReportRepository.getExpensesKopecks(from, to),
      this.financeReportRepository.getPaidOrdersCount(from, to),
      this.financeReportRepository.getOrdersCount(from, to),
      this.financeReportRepository.getDistinctClientsCount(from, to),
      this.financeReportRepository.getRevenueChart(groupBy, from, to),
      this.financeReportRepository.getExpensesChart(groupBy, from, to),
      this.financeReportRepository.getRecentOrders(from, to, RECENT_ORDERS_LIMIT),
    ]);

    const chart = mergeChartBuckets(revenueChart, expensesChart);

    const uniqueClientIds = [...new Set(recentOrdersRaw.map((order) => order.clientId))];
    const clients = await Promise.all(
      uniqueClientIds.map((id) => this.clientRepository.findById(id)),
    );
    const clientPublicIdById = new Map(clients.map((client, i) => [uniqueClientIds[i], client!.publicId]));

    const recentOrders: FinanceRecentOrder[] = recentOrdersRaw.map((order) => ({
      publicId: order.publicId,
      clientPublicId: clientPublicIdById.get(order.clientId)!,
      scheduledAt: order.scheduledAt,
      status: order.status,
      totalKopecks: order.totalKopecks,
    }));

    return {
      revenueKopecks,
      expensesKopecks,
      netProfitKopecks: revenueKopecks - expensesKopecks,
      averageCheckKopecks: paidOrdersCount > 0 ? Math.round(revenueKopecks / paidOrdersCount) : 0,
      clientsCount,
      ordersCount,
      chart,
      recentOrders,
    };
  }
}

function mergeChartBuckets(
  revenue: { bucket: Date; amountKopecks: number }[],
  expenses: { bucket: Date; amountKopecks: number }[],
): FinanceChartPoint[] {
  const revenueByBucket = new Map(revenue.map((p) => [p.bucket.toISOString(), p.amountKopecks]));
  const expensesByBucket = new Map(expenses.map((p) => [p.bucket.toISOString(), p.amountKopecks]));
  const bucketKeys = [...new Set([...revenueByBucket.keys(), ...expensesByBucket.keys()])].sort();

  return bucketKeys.map((key) => ({
    bucket: new Date(key),
    revenueKopecks: revenueByBucket.get(key) ?? 0,
    expensesKopecks: expensesByBucket.get(key) ?? 0,
  }));
}

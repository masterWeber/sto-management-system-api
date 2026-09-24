import type { FinanceSummary } from '../../application/finance-summary.js';

class FinanceChartPointDto {
  bucket!: Date;
  revenueKopecks!: number;
  expensesKopecks!: number;
}

class FinanceRecentOrderDto {
  orderId!: string;
  clientId!: string;
  scheduledAt!: Date;
  status!: string;
  totalKopecks!: number;
}

export class FinanceSummaryResponseDto {
  revenueKopecks: number;
  expensesKopecks: number;
  netProfitKopecks: number;
  averageCheckKopecks: number;
  clientsCount: number;
  ordersCount: number;
  chart: FinanceChartPointDto[];
  recentOrders: FinanceRecentOrderDto[];

  private constructor(summary: FinanceSummary) {
    this.revenueKopecks = summary.revenueKopecks;
    this.expensesKopecks = summary.expensesKopecks;
    this.netProfitKopecks = summary.netProfitKopecks;
    this.averageCheckKopecks = summary.averageCheckKopecks;
    this.clientsCount = summary.clientsCount;
    this.ordersCount = summary.ordersCount;
    this.chart = summary.chart;
    this.recentOrders = summary.recentOrders.map((order) => ({
      orderId: order.publicId,
      clientId: order.clientPublicId,
      scheduledAt: order.scheduledAt,
      status: order.status,
      totalKopecks: order.totalKopecks,
    }));
  }

  static fromDomain(summary: FinanceSummary): FinanceSummaryResponseDto {
    return new FinanceSummaryResponseDto(summary);
  }
}

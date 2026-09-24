export type FinanceGroupBy = 'day' | 'week' | 'month' | 'quarter';

export const FINANCE_GROUP_BY_VALUES: FinanceGroupBy[] = ['day', 'week', 'month', 'quarter'];

export interface FinanceChartPoint {
  bucket: Date;
  revenueKopecks: number;
  expensesKopecks: number;
}

export interface FinanceRecentOrder {
  publicId: string;
  clientPublicId: string;
  scheduledAt: Date;
  status: string;
  totalKopecks: number;
}

export interface FinanceSummary {
  revenueKopecks: number;
  expensesKopecks: number;
  netProfitKopecks: number;
  averageCheckKopecks: number;
  clientsCount: number;
  ordersCount: number;
  chart: FinanceChartPoint[];
  recentOrders: FinanceRecentOrder[];
}

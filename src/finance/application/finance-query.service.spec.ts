import { jest } from '@jest/globals';
import type { ClientRepository } from '../../clients/domain/client-repository.port.js';
import { Client } from '../../clients/domain/client.entity.js';
import type { FinanceReportRepository } from '../infrastructure/finance-report.repository.js';
import { FinanceQueryService } from './finance-query.service.js';

describe('FinanceQueryService', () => {
  const from = new Date('2026-01-01');
  const to = new Date('2026-01-31');

  let financeReportRepository: jest.Mocked<FinanceReportRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let service: FinanceQueryService;

  beforeEach(() => {
    financeReportRepository = {
      getRevenueKopecks: jest.fn(),
      getExpensesKopecks: jest.fn(),
      getPaidOrdersCount: jest.fn(),
      getOrdersCount: jest.fn(),
      getDistinctClientsCount: jest.fn(),
      getRevenueChart: jest.fn(),
      getExpensesChart: jest.fn(),
      getRecentOrders: jest.fn(),
    } as unknown as jest.Mocked<FinanceReportRepository>;
    clientRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    service = new FinanceQueryService(financeReportRepository, clientRepository);
  });

  it('returns 0 average check when there are no paid orders, instead of dividing by zero', async () => {
    financeReportRepository.getRevenueKopecks.mockResolvedValue(0);
    financeReportRepository.getExpensesKopecks.mockResolvedValue(0);
    financeReportRepository.getPaidOrdersCount.mockResolvedValue(0);
    financeReportRepository.getOrdersCount.mockResolvedValue(0);
    financeReportRepository.getDistinctClientsCount.mockResolvedValue(0);
    financeReportRepository.getRevenueChart.mockResolvedValue([]);
    financeReportRepository.getExpensesChart.mockResolvedValue([]);
    financeReportRepository.getRecentOrders.mockResolvedValue([]);

    const summary = await service.getSummary(from, to, 'month');

    expect(summary.averageCheckKopecks).toBe(0);
    expect(summary.netProfitKopecks).toBe(0);
  });

  it('computes netProfit and averageCheck from revenue, expenses and paid order count', async () => {
    financeReportRepository.getRevenueKopecks.mockResolvedValue(200000);
    financeReportRepository.getExpensesKopecks.mockResolvedValue(50000);
    financeReportRepository.getPaidOrdersCount.mockResolvedValue(4);
    financeReportRepository.getOrdersCount.mockResolvedValue(10);
    financeReportRepository.getDistinctClientsCount.mockResolvedValue(3);
    financeReportRepository.getRevenueChart.mockResolvedValue([]);
    financeReportRepository.getExpensesChart.mockResolvedValue([]);
    financeReportRepository.getRecentOrders.mockResolvedValue([]);

    const summary = await service.getSummary(from, to, 'month');

    expect(summary.netProfitKopecks).toBe(150000);
    expect(summary.averageCheckKopecks).toBe(50000);
    expect(summary.clientsCount).toBe(3);
    expect(summary.ordersCount).toBe(10);
  });

  it('merges revenue and expense chart buckets by date, filling missing sides with zero', async () => {
    financeReportRepository.getRevenueKopecks.mockResolvedValue(0);
    financeReportRepository.getExpensesKopecks.mockResolvedValue(0);
    financeReportRepository.getPaidOrdersCount.mockResolvedValue(0);
    financeReportRepository.getOrdersCount.mockResolvedValue(0);
    financeReportRepository.getDistinctClientsCount.mockResolvedValue(0);
    financeReportRepository.getRevenueChart.mockResolvedValue([
      { bucket: new Date('2026-01-01'), amountKopecks: 1000 },
    ]);
    financeReportRepository.getExpensesChart.mockResolvedValue([
      { bucket: new Date('2026-01-01'), amountKopecks: 500 },
      { bucket: new Date('2026-02-01'), amountKopecks: 700 },
    ]);
    financeReportRepository.getRecentOrders.mockResolvedValue([]);

    const summary = await service.getSummary(from, to, 'month');

    expect(summary.chart).toEqual([
      { bucket: new Date('2026-01-01'), revenueKopecks: 1000, expensesKopecks: 500 },
      { bucket: new Date('2026-02-01'), revenueKopecks: 0, expensesKopecks: 700 },
    ]);
  });

  it('resolves each recent order client public id, deduplicating repeated clients', async () => {
    const client = new Client(1, 'Ivan', 'Ivanov', '+79001234567', 'client-public-id');
    financeReportRepository.getRevenueKopecks.mockResolvedValue(0);
    financeReportRepository.getExpensesKopecks.mockResolvedValue(0);
    financeReportRepository.getPaidOrdersCount.mockResolvedValue(0);
    financeReportRepository.getOrdersCount.mockResolvedValue(0);
    financeReportRepository.getDistinctClientsCount.mockResolvedValue(0);
    financeReportRepository.getRevenueChart.mockResolvedValue([]);
    financeReportRepository.getExpensesChart.mockResolvedValue([]);
    financeReportRepository.getRecentOrders.mockResolvedValue([
      { id: 1, publicId: 'order-1', clientId: 1, scheduledAt: from, status: 'PAID', totalKopecks: 1000 },
      { id: 2, publicId: 'order-2', clientId: 1, scheduledAt: from, status: 'PAID', totalKopecks: 2000 },
    ]);
    clientRepository.findById.mockResolvedValue(client);

    const summary = await service.getSummary(from, to, 'month');

    expect(clientRepository.findById).toHaveBeenCalledTimes(1);
    expect(summary.recentOrders).toEqual([
      { publicId: 'order-1', clientPublicId: 'client-public-id', scheduledAt: from, status: 'PAID', totalKopecks: 1000 },
      { publicId: 'order-2', clientPublicId: 'client-public-id', scheduledAt: from, status: 'PAID', totalKopecks: 2000 },
    ]);
  });
});

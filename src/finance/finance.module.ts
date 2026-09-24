import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module.js';
import { ExpenseOrmEntity } from '../expenses/infrastructure/persistence/expense.orm-entity.js';
import { OrderItemOrmEntity } from '../orders/infrastructure/persistence/order-item.orm-entity.js';
import { OrderOrmEntity } from '../orders/infrastructure/persistence/order.orm-entity.js';
import { FinanceQueryService } from './application/finance-query.service.js';
import { GenerateFinanceReportPdfUseCase } from './application/use-cases/generate-finance-report-pdf.use-case.js';
import { FinanceReportRepository } from './infrastructure/finance-report.repository.js';
import { FinanceController } from './interface/finance.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderOrmEntity, OrderItemOrmEntity, ExpenseOrmEntity]),
    ClientsModule,
  ],
  controllers: [FinanceController],
  providers: [FinanceReportRepository, FinanceQueryService, GenerateFinanceReportPdfUseCase],
})
export class FinanceModule {}

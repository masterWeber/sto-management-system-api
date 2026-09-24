import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module.js';
import { CarsModule } from './cars/cars.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { dataSourceOptions } from './data-source.js';
import { ExpensesModule } from './expenses/expenses.module.js';
import { FinanceModule } from './finance/finance.module.js';
import { HealthController } from './health.controller.js';
import { OrdersModule } from './orders/orders.module.js';
import { PriceListModule } from './price-list/price-list.module.js';
import { SharedModule } from './shared/shared.module.js';
import { StaffModule } from './staff/staff.module.js';
import { WarehouseModule } from './warehouse/warehouse.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 100 }],
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      synchronize: false,
    }),
    SharedModule,
    AuthModule,
    StaffModule,
    ClientsModule,
    CarsModule,
    PriceListModule,
    WarehouseModule,
    OrdersModule,
    ExpensesModule,
    FinanceModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { CarsModule } from './cars/cars.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { dataSourceOptions } from './data-source.js';
import { HealthController } from './health.controller.js';
import { PriceListModule } from './price-list/price-list.module.js';
import { SharedModule } from './shared/shared.module.js';
import { StaffModule } from './staff/staff.module.js';
import { WarehouseModule } from './warehouse/warehouse.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [HealthController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { dataSourceOptions } from './data-source.js';
import { HealthController } from './health.controller.js';
import { SharedModule } from './shared/shared.module.js';
import { StaffModule } from './staff/staff.module.js';

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
  ],
  controllers: [HealthController],
})
export class AppModule {}

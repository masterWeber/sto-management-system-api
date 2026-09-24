import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsModule } from '../cars/cars.module.js';
import { ClientsModule } from '../clients/clients.module.js';
import { PriceListModule } from '../price-list/price-list.module.js';
import { StaffModule } from '../staff/staff.module.js';
import { ORDER_REPOSITORY } from './domain/order-repository.port.js';
import { OrderItemOrmEntity } from './infrastructure/persistence/order-item.orm-entity.js';
import { OrderOrmEntity } from './infrastructure/persistence/order.orm-entity.js';
import { TypeOrmOrderRepository } from './infrastructure/typeorm-order.repository.js';
import { AddOrderItemUseCase } from './application/use-cases/add-order-item.use-case.js';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case.js';
import { DeleteOrderUseCase } from './application/use-cases/delete-order.use-case.js';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case.js';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case.js';
import { RemoveOrderItemUseCase } from './application/use-cases/remove-order-item.use-case.js';
import { TransitionOrderStatusUseCase } from './application/use-cases/transition-order-status.use-case.js';
import { UpdateOrderUseCase } from './application/use-cases/update-order.use-case.js';
import { OrdersController } from './interface/orders.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderOrmEntity, OrderItemOrmEntity]),
    ClientsModule,
    CarsModule,
    StaffModule,
    PriceListModule,
  ],
  controllers: [OrdersController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: TypeOrmOrderRepository },
    CreateOrderUseCase,
    UpdateOrderUseCase,
    DeleteOrderUseCase,
    GetOrderUseCase,
    ListOrdersUseCase,
    TransitionOrderStatusUseCase,
    AddOrderItemUseCase,
    RemoveOrderItemUseCase,
  ],
})
export class OrdersModule {}

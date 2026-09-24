import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SERVICE_CATEGORY_REPOSITORY } from './domain/service-category-repository.port.js';
import { SERVICE_REPOSITORY } from './domain/service-repository.port.js';
import { ServiceCategoryOrmEntity } from './infrastructure/persistence/service-category.orm-entity.js';
import { ServiceOrmEntity } from './infrastructure/persistence/service.orm-entity.js';
import { TypeOrmServiceCategoryRepository } from './infrastructure/typeorm-service-category.repository.js';
import { TypeOrmServiceRepository } from './infrastructure/typeorm-service.repository.js';
import { CreateServiceCategoryUseCase } from './application/use-cases/create-service-category.use-case.js';
import { UpdateServiceCategoryUseCase } from './application/use-cases/update-service-category.use-case.js';
import { DeleteServiceCategoryUseCase } from './application/use-cases/delete-service-category.use-case.js';
import { GetServiceCategoryUseCase } from './application/use-cases/get-service-category.use-case.js';
import { ListServiceCategoriesUseCase } from './application/use-cases/list-service-categories.use-case.js';
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case.js';
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case.js';
import { DeleteServiceUseCase } from './application/use-cases/delete-service.use-case.js';
import { GetServiceUseCase } from './application/use-cases/get-service.use-case.js';
import { ListServicesUseCase } from './application/use-cases/list-services.use-case.js';
import { ServiceCategoriesController } from './interface/service-categories.controller.js';
import { ServicesController } from './interface/services.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategoryOrmEntity, ServiceOrmEntity])],
  controllers: [ServiceCategoriesController, ServicesController],
  providers: [
    { provide: SERVICE_CATEGORY_REPOSITORY, useClass: TypeOrmServiceCategoryRepository },
    { provide: SERVICE_REPOSITORY, useClass: TypeOrmServiceRepository },
    CreateServiceCategoryUseCase,
    UpdateServiceCategoryUseCase,
    DeleteServiceCategoryUseCase,
    GetServiceCategoryUseCase,
    ListServiceCategoriesUseCase,
    CreateServiceUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
    GetServiceUseCase,
    ListServicesUseCase,
  ],
})
export class PriceListModule {}

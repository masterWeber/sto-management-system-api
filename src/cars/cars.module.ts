import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '../clients/clients.module.js';
import { CAR_REPOSITORY } from './domain/car-repository.port.js';
import { CarOrmEntity } from './infrastructure/persistence/car.orm-entity.js';
import { TypeOrmCarRepository } from './infrastructure/typeorm-car.repository.js';
import { CreateCarUseCase } from './application/use-cases/create-car.use-case.js';
import { UpdateCarUseCase } from './application/use-cases/update-car.use-case.js';
import { DeleteCarUseCase } from './application/use-cases/delete-car.use-case.js';
import { GetCarUseCase } from './application/use-cases/get-car.use-case.js';
import { ListCarsUseCase } from './application/use-cases/list-cars.use-case.js';
import { CarsController } from './interface/cars.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([CarOrmEntity]), ClientsModule],
  controllers: [CarsController],
  providers: [
    { provide: CAR_REPOSITORY, useClass: TypeOrmCarRepository },
    CreateCarUseCase,
    UpdateCarUseCase,
    DeleteCarUseCase,
    GetCarUseCase,
    ListCarsUseCase,
  ],
})
export class CarsModule {}

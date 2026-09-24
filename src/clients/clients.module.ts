import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CLIENT_REPOSITORY } from './domain/client-repository.port.js';
import { ClientOrmEntity } from './infrastructure/persistence/client.orm-entity.js';
import { TypeOrmClientRepository } from './infrastructure/typeorm-client.repository.js';
import { CreateClientUseCase } from './application/use-cases/create-client.use-case.js';
import { UpdateClientUseCase } from './application/use-cases/update-client.use-case.js';
import { DeleteClientUseCase } from './application/use-cases/delete-client.use-case.js';
import { GetClientUseCase } from './application/use-cases/get-client.use-case.js';
import { ListClientsUseCase } from './application/use-cases/list-clients.use-case.js';
import { ClientsController } from './interface/clients.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ClientOrmEntity])],
  controllers: [ClientsController],
  providers: [
    { provide: CLIENT_REPOSITORY, useClass: TypeOrmClientRepository },
    CreateClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    GetClientUseCase,
    ListClientsUseCase,
  ],
})
export class ClientsModule {}

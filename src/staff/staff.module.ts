import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STAFF_REPOSITORY } from './domain/staff-repository.port.js';
import { StaffUserOrmEntity } from './infrastructure/persistence/staff-user.orm-entity.js';
import { TypeOrmStaffRepository } from './infrastructure/typeorm-staff.repository.js';
import { CreateStaffUseCase } from './application/use-cases/create-staff.use-case.js';
import { UpdateStaffUseCase } from './application/use-cases/update-staff.use-case.js';
import { DeactivateStaffUseCase } from './application/use-cases/deactivate-staff.use-case.js';
import { GetStaffUseCase } from './application/use-cases/get-staff.use-case.js';
import { ListStaffUseCase } from './application/use-cases/list-staff.use-case.js';
import { StaffController } from './interface/staff.controller.js';
import { SeedAdminService } from './application/seed-admin.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([StaffUserOrmEntity])],
  controllers: [StaffController],
  providers: [
    { provide: STAFF_REPOSITORY, useClass: TypeOrmStaffRepository },
    CreateStaffUseCase,
    UpdateStaffUseCase,
    DeactivateStaffUseCase,
    GetStaffUseCase,
    ListStaffUseCase,
    SeedAdminService,
  ],
  exports: [STAFF_REPOSITORY],
})
export class StaffModule {}

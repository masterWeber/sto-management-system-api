import { ConflictError } from '../../shared/domain/errors/domain-error.js';
import { Role } from '../../shared/domain/role.js';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { CreateStaffUseCase } from './use-cases/create-staff.use-case.js';

const DEFAULT_ADMIN_LOGIN = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin';

@Injectable()
export class SeedAdminService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedAdminService.name);

  constructor(private readonly createStaff: CreateStaffUseCase) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.createAdminIfMissing();
  }

  async createAdminIfMissing(): Promise<void> {
    const login = process.env.ADMIN_LOGIN ?? DEFAULT_ADMIN_LOGIN;
    const password = process.env.ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;
    try {
      await this.createStaff.execute({
        fullName: 'Администратор',
        login,
        password,
        role: Role.ADMIN,
      });
    } catch (error) {
      if (error instanceof ConflictError) return;
      throw error;
    }
  }
}
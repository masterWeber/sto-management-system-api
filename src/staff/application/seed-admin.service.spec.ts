import { jest } from '@jest/globals';
import { ConflictError } from '../../shared/domain/errors/domain-error.js';
import { Role } from '../../shared/domain/role.js';
import { StaffUser } from '../domain/staff-user.entity.js';
import type { CreateStaffUseCase } from './create-staff.use-case.js';
import { SeedAdminService } from './seed-admin.service.js';

describe('SeedAdminService', () => {
  let createStaff: jest.Mocked<Pick<CreateStaffUseCase, 'execute'>>;
  let service: SeedAdminService;

  const originalAdminLogin = process.env.ADMIN_LOGIN;
  const originalAdminPassword = process.env.ADMIN_PASSWORD;

  function setEnv(login?: string, password?: string) {
    if (login === undefined) delete process.env.ADMIN_LOGIN;
    else process.env.ADMIN_LOGIN = login;
    if (password === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = password;
  }

  function restoreEnv(variable: string, original: string | undefined) {
    if (original === undefined) delete process.env[variable];
    else process.env[variable] = original;
  }

  beforeEach(() => {
    setEnv();
    createStaff = { execute: jest.fn() };
    service = new SeedAdminService(createStaff as unknown as CreateStaffUseCase);
  });

  afterAll(() => {
    restoreEnv('ADMIN_LOGIN', originalAdminLogin);
    restoreEnv('ADMIN_PASSWORD', originalAdminPassword);
  });

  it('creates an admin user with credentials from env', async () => {
    setEnv('root', 'secret');
    const saved = new StaffUser(1, 'Администратор', 'root', 'hashed', Role.ADMIN);
    createStaff.execute.mockResolvedValue(saved);

    await service.createAdminIfMissing();

    expect(createStaff.execute).toHaveBeenCalledWith({
      fullName: 'Администратор',
      login: 'root',
      password: 'secret',
      role: Role.ADMIN,
    });
  });

  it('does nothing when the admin login is already taken', async () => {
    setEnv('root', 'secret');
    createStaff.execute.mockRejectedValue(
      new ConflictError('Login "root" is already taken'),
    );

    await expect(service.createAdminIfMissing()).resolves.toBeUndefined();
    expect(createStaff.execute).toHaveBeenCalledTimes(1);
  });

  it('uses default credentials when env vars are not set', async () => {
    const saved = new StaffUser(1, 'Администратор', 'admin', 'hashed', Role.ADMIN);
    createStaff.execute.mockResolvedValue(saved);

    await service.createAdminIfMissing();

    expect(createStaff.execute).toHaveBeenCalledWith({
      fullName: 'Администратор',
      login: 'admin',
      password: 'admin',
      role: Role.ADMIN,
    });
  });
});
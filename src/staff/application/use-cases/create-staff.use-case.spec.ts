import { jest } from '@jest/globals';
import type { PasswordHasher } from '../../../shared/application/ports/password-hasher.port.js';
import { ConflictError } from '../../../shared/domain/errors/domain-error.js';
import { Role } from '../../../shared/domain/role.js';
import type { StaffRepository } from '../../domain/staff-repository.port.js';
import { StaffUser } from '../../domain/staff-user.entity.js';
import { CreateStaffUseCase } from './create-staff.use-case.js';

describe('CreateStaffUseCase', () => {
  let staffRepository: jest.Mocked<StaffRepository>;
  let passwordHasher: jest.Mocked<PasswordHasher>;
  let useCase: CreateStaffUseCase;

  beforeEach(() => {
    staffRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findByLogin: jest.fn().mockResolvedValue(null),
      findAll: jest.fn(),
      save: jest.fn(async (staff: StaffUser) => staff),
    };
    passwordHasher = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
      verify: jest.fn(),
    };
    useCase = new CreateStaffUseCase(staffRepository, passwordHasher);
  });

  it('hashes the password and saves a new staff user', async () => {
    const staff = await useCase.execute({
      fullName: 'Ivan Ivanov',
      login: 'ivan',
      password: 'plain-password',
      role: Role.MASTER,
    });

    expect(passwordHasher.hash).toHaveBeenCalledWith('plain-password');
    expect(staff.passwordHash).toBe('hashed-password');
    expect(staff.login).toBe('ivan');
    expect(staffRepository.save).toHaveBeenCalledTimes(1);
  });

  it('throws ConflictError when the login is already taken and never saves', async () => {
    staffRepository.findByLogin.mockResolvedValue(
      new StaffUser(1, 'Existing', 'ivan', 'hash', Role.MASTER),
    );

    await expect(
      useCase.execute({
        fullName: 'Ivan Ivanov',
        login: 'ivan',
        password: 'plain-password',
        role: Role.MASTER,
      }),
    ).rejects.toThrow(ConflictError);
    expect(staffRepository.save).not.toHaveBeenCalled();
    expect(passwordHasher.hash).not.toHaveBeenCalled();
  });
});

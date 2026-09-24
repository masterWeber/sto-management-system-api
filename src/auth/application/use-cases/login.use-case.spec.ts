import { jest } from '@jest/globals';
import type { PasswordHasher } from '../../../shared/application/ports/password-hasher.port.js';
import { ValidationError } from '../../../shared/domain/errors/domain-error.js';
import { Role } from '../../../shared/domain/role.js';
import type { StaffRepository } from '../../../staff/domain/staff-repository.port.js';
import { StaffUser } from '../../../staff/domain/staff-user.entity.js';
import type { AuthTokenService } from '../ports/auth-token.port.js';
import { LoginUseCase } from './login.use-case.js';

describe('LoginUseCase', () => {
  const activeStaff = new StaffUser(
    1,
    'Ivan Ivanov',
    'ivan',
    'hashed-password',
    Role.ADMIN,
    true,
    'staff-public-id',
  );

  let staffRepository: jest.Mocked<StaffRepository>;
  let passwordHasher: jest.Mocked<PasswordHasher>;
  let authTokenService: jest.Mocked<AuthTokenService>;
  let useCase: LoginUseCase;

  beforeEach(() => {
    staffRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findByLogin: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    };
    passwordHasher = {
      hash: jest.fn(),
      verify: jest.fn(),
    };
    authTokenService = {
      issue: jest.fn().mockResolvedValue('signed-jwt'),
    };
    useCase = new LoginUseCase(staffRepository, passwordHasher, authTokenService);
  });

  it('issues a token with the staff public id and role on correct credentials', async () => {
    staffRepository.findByLogin.mockResolvedValue(activeStaff);
    passwordHasher.verify.mockResolvedValue(true);

    const token = await useCase.execute({ login: 'ivan', password: 'correct-password' });

    expect(passwordHasher.verify).toHaveBeenCalledWith('correct-password', 'hashed-password');
    expect(authTokenService.issue).toHaveBeenCalledWith({
      userId: 'staff-public-id',
      role: Role.ADMIN,
    });
    expect(token).toBe('signed-jwt');
  });

  it('rejects an unknown login without checking the password', async () => {
    staffRepository.findByLogin.mockResolvedValue(null);

    await expect(useCase.execute({ login: 'ghost', password: 'anything' })).rejects.toThrow(
      ValidationError,
    );
    expect(passwordHasher.verify).not.toHaveBeenCalled();
    expect(authTokenService.issue).not.toHaveBeenCalled();
  });

  it('rejects a deactivated staff user even with the correct password', async () => {
    staffRepository.findByLogin.mockResolvedValue(
      new StaffUser(1, 'Ivan Ivanov', 'ivan', 'hashed-password', Role.ADMIN, false),
    );

    await expect(useCase.execute({ login: 'ivan', password: 'correct-password' })).rejects.toThrow(
      ValidationError,
    );
    expect(passwordHasher.verify).not.toHaveBeenCalled();
  });

  it('rejects an incorrect password and never issues a token', async () => {
    staffRepository.findByLogin.mockResolvedValue(activeStaff);
    passwordHasher.verify.mockResolvedValue(false);

    await expect(useCase.execute({ login: 'ivan', password: 'wrong-password' })).rejects.toThrow(
      ValidationError,
    );
    expect(authTokenService.issue).not.toHaveBeenCalled();
  });
});

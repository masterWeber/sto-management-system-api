import { jest } from '@jest/globals';
import { UnauthorizedException } from '@nestjs/common';
import type { StaffRepository } from '../../staff/domain/staff-repository.port.js';
import { StaffUser } from '../../staff/domain/staff-user.entity.js';
import { Role } from '../../shared/domain/role.js';
import { JwtStrategy } from './jwt.strategy.js';

function createRepo(
  overrides: Partial<StaffRepository> = {},
): StaffRepository {
  return {
    findById: jest.fn(),
    findByPublicId: jest.fn(),
    findByLogin: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    ...overrides,
  };
}

describe('JwtStrategy', () => {
  it('uses the live staff record (current role, not the role from the token)', async () => {
    const staff = new StaffUser(1, 'Ivan', 'ivan', 'hash', Role.MANAGER, true, 'pub-1');
    const strategy = new JwtStrategy(
      createRepo({ findByPublicId: async (id) => (id === 'pub-1' ? staff : null) }),
    );

    await expect(
      strategy.validate({ sub: 'pub-1', role: Role.MASTER }),
    ).resolves.toEqual({ userId: 'pub-1', role: Role.MANAGER });
  });

  it('rejects a token for a deactivated staff member', async () => {
    const staff = new StaffUser(1, 'Ivan', 'ivan', 'hash', Role.MANAGER, false, 'pub-1');
    const strategy = new JwtStrategy(
      createRepo({ findByPublicId: async () => staff }),
    );

    await expect(
      strategy.validate({ sub: 'pub-1', role: Role.MANAGER }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a token for a staff member that no longer exists', async () => {
    const strategy = new JwtStrategy(createRepo({ findByPublicId: async () => null }));

    await expect(
      strategy.validate({ sub: 'gone', role: Role.ADMIN }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
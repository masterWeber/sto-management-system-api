import { jest } from '@jest/globals';
import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { Role } from '../../domain/role.js';
import { RolesGuard } from './roles.guard.js';

function createContext(role: Role): ExecutionContext {
  return {
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ user: { userId: 'user-id', role } }),
      getResponse: () => ({}),
      getNext: () => ({}),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  it('allows access when the route declares no required roles', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue(undefined) } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext(Role.MASTER))).toBe(true);
  });

  it('allows access when the user has one of the required roles', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN, Role.MANAGER]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext(Role.MANAGER))).toBe(true);
  });

  it('denies access when the user role is not in the required list', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext(Role.MASTER))).toBe(false);
  });

  it('treats an empty required-roles array the same as no restriction', () => {
    const reflector = { getAllAndOverride: jest.fn().mockReturnValue([]) } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext(Role.MASTER))).toBe(true);
  });
});

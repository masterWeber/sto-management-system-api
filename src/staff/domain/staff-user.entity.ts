import { randomUUID } from 'node:crypto';
import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import type { Role } from '../../shared/domain/role.js';

export class StaffUser {
  constructor(
    public readonly id: number | undefined,
    public fullName: string,
    public readonly login: string,
    public passwordHash: string,
    public role: Role,
    public isActive: boolean = true,
    public readonly publicId: string = randomUUID(),
  ) {
    if (!login || login.trim().length === 0) {
      throw new ValidationError('Staff login is required');
    }
  }

  deactivate(): void {
    this.isActive = false;
  }

  changeRole(role: Role): void {
    this.role = role;
  }
}

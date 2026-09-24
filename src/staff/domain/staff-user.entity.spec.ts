import { ValidationError } from '../../shared/domain/errors/domain-error.js';
import { Role } from '../../shared/domain/role.js';
import { StaffUser } from './staff-user.entity.js';

describe('StaffUser', () => {
  it('creates an active staff user by default', () => {
    const staff = new StaffUser(undefined, 'Ivan Ivanov', 'ivan', 'hash', Role.MASTER);
    expect(staff.isActive).toBe(true);
    expect(staff.role).toBe(Role.MASTER);
  });

  it('rejects an empty login', () => {
    expect(
      () => new StaffUser(undefined, 'Ivan Ivanov', '', 'hash', Role.MASTER),
    ).toThrow(ValidationError);
  });

  it('rejects a whitespace-only login', () => {
    expect(
      () => new StaffUser(undefined, 'Ivan Ivanov', '   ', 'hash', Role.MASTER),
    ).toThrow(ValidationError);
  });

  it('auto-generates a unique publicId when none is given', () => {
    const a = new StaffUser(undefined, 'Ivan Ivanov', 'ivan', 'hash', Role.MASTER);
    const b = new StaffUser(undefined, 'Petr Petrov', 'petr', 'hash', Role.MANAGER);
    expect(a.publicId).toMatch(/^[0-9a-f-]{36}$/);
    expect(a.publicId).not.toBe(b.publicId);
  });

  it('deactivate() sets isActive to false', () => {
    const staff = new StaffUser(undefined, 'Ivan Ivanov', 'ivan', 'hash', Role.MASTER);
    staff.deactivate();
    expect(staff.isActive).toBe(false);
  });

  it('changeRole() updates the role', () => {
    const staff = new StaffUser(undefined, 'Ivan Ivanov', 'ivan', 'hash', Role.MASTER);
    staff.changeRole(Role.ADMIN);
    expect(staff.role).toBe(Role.ADMIN);
  });
});

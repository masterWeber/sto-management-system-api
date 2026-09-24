import { jest } from '@jest/globals';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { Role } from '../../../shared/domain/role.js';
import type { StaffRepository } from '../../domain/staff-repository.port.js';
import { StaffUser } from '../../domain/staff-user.entity.js';
import { UpdateStaffUseCase } from './update-staff.use-case.js';

describe('UpdateStaffUseCase', () => {
  let staffRepository: jest.Mocked<StaffRepository>;
  let useCase: UpdateStaffUseCase;

  beforeEach(() => {
    staffRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findByLogin: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(async (staff: StaffUser) => staff),
    };
    useCase = new UpdateStaffUseCase(staffRepository);
  });

  it('updates only the provided fields', async () => {
    const staff = new StaffUser(1, 'Ivan Ivanov', 'ivan', 'hash', Role.MASTER, true, 'staff-public-id');
    staffRepository.findByPublicId.mockResolvedValue(staff);

    const updated = await useCase.execute('staff-public-id', { role: Role.MANAGER });

    expect(updated.role).toBe(Role.MANAGER);
    expect(updated.fullName).toBe('Ivan Ivanov');
  });

  it('updates fullName when provided', async () => {
    const staff = new StaffUser(1, 'Ivan Ivanov', 'ivan', 'hash', Role.MASTER, true, 'staff-public-id');
    staffRepository.findByPublicId.mockResolvedValue(staff);

    const updated = await useCase.execute('staff-public-id', { fullName: 'Petr Petrov' });

    expect(updated.fullName).toBe('Petr Petrov');
    expect(updated.role).toBe(Role.MASTER);
  });

  it('throws NotFoundError when the staff user does not exist', async () => {
    staffRepository.findByPublicId.mockResolvedValue(null);

    await expect(useCase.execute('missing', { role: Role.ADMIN })).rejects.toThrow(NotFoundError);
    expect(staffRepository.save).not.toHaveBeenCalled();
  });
});

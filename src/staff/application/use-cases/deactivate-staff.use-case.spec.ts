import { jest } from '@jest/globals';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { Role } from '../../../shared/domain/role.js';
import type { StaffRepository } from '../../domain/staff-repository.port.js';
import { StaffUser } from '../../domain/staff-user.entity.js';
import { DeactivateStaffUseCase } from './deactivate-staff.use-case.js';

describe('DeactivateStaffUseCase', () => {
  let staffRepository: jest.Mocked<StaffRepository>;
  let useCase: DeactivateStaffUseCase;

  beforeEach(() => {
    staffRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findByLogin: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(async (staff: StaffUser) => staff),
    };
    useCase = new DeactivateStaffUseCase(staffRepository);
  });

  it('deactivates and saves the staff user', async () => {
    const staff = new StaffUser(1, 'Ivan Ivanov', 'ivan', 'hash', Role.MASTER, true, 'staff-public-id');
    staffRepository.findByPublicId.mockResolvedValue(staff);

    await useCase.execute('staff-public-id');

    expect(staff.isActive).toBe(false);
    expect(staffRepository.save).toHaveBeenCalledWith(staff);
  });

  it('throws NotFoundError and never saves when the staff user does not exist', async () => {
    staffRepository.findByPublicId.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
    expect(staffRepository.save).not.toHaveBeenCalled();
  });
});

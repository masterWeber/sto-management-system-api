import { jest } from '@jest/globals';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import { Role } from '../../../shared/domain/role.js';
import type { StaffRepository } from '../../domain/staff-repository.port.js';
import { StaffUser } from '../../domain/staff-user.entity.js';
import { GetStaffUseCase } from './get-staff.use-case.js';

describe('GetStaffUseCase', () => {
  let staffRepository: jest.Mocked<StaffRepository>;
  let useCase: GetStaffUseCase;

  beforeEach(() => {
    staffRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findByLogin: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    };
    useCase = new GetStaffUseCase(staffRepository);
  });

  it('returns the staff user found by public id', async () => {
    const staff = new StaffUser(1, 'Ivan Ivanov', 'ivan', 'hash', Role.MASTER, true, 'staff-public-id');
    staffRepository.findByPublicId.mockResolvedValue(staff);

    const result = await useCase.execute('staff-public-id');

    expect(result).toBe(staff);
  });

  it('throws NotFoundError when the staff user does not exist', async () => {
    staffRepository.findByPublicId.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
  });
});

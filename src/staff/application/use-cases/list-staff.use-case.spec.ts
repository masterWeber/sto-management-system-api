import { jest } from '@jest/globals';
import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { StaffRepository } from '../../domain/staff-repository.port.js';
import { StaffUser } from '../../domain/staff-user.entity.js';
import { ListStaffUseCase } from './list-staff.use-case.js';

describe('ListStaffUseCase', () => {
  let staffRepository: jest.Mocked<StaffRepository>;
  let useCase: ListStaffUseCase;

  beforeEach(() => {
    staffRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findByLogin: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    };
    useCase = new ListStaffUseCase(staffRepository);
  });

  it('passes pagination straight through to the repository', async () => {
    const page: PaginatedResult<StaffUser> = { items: [], total: 0, page: 2, limit: 10 };
    staffRepository.findAll.mockResolvedValue(page);

    const result = await useCase.execute({ page: 2, limit: 10 });

    expect(staffRepository.findAll).toHaveBeenCalledWith({ page: 2, limit: 10 });
    expect(result).toBe(page);
  });
});

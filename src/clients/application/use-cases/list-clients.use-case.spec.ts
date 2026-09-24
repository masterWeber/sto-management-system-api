import { jest } from '@jest/globals';
import type { PaginatedResult } from '../../../shared/domain/pagination.js';
import type { ClientRepository } from '../../domain/client-repository.port.js';
import { Client } from '../../domain/client.entity.js';
import { ListClientsUseCase } from './list-clients.use-case.js';

describe('ListClientsUseCase', () => {
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: ListClientsUseCase;

  beforeEach(() => {
    clientRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new ListClientsUseCase(clientRepository);
  });

  it('passes filters and pagination straight through to the repository', async () => {
    const page: PaginatedResult<Client> = { items: [], total: 0, page: 1, limit: 20 };
    clientRepository.findAll.mockResolvedValue(page);

    const result = await useCase.execute(
      { search: 'Ivan', phone: '+7900' },
      { page: 1, limit: 20 },
    );

    expect(clientRepository.findAll).toHaveBeenCalledWith(
      { search: 'Ivan', phone: '+7900' },
      { page: 1, limit: 20 },
    );
    expect(result).toBe(page);
  });
});

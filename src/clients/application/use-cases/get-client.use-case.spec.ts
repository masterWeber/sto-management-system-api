import { jest } from '@jest/globals';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import type { ClientRepository } from '../../domain/client-repository.port.js';
import { Client } from '../../domain/client.entity.js';
import { GetClientUseCase } from './get-client.use-case.js';

describe('GetClientUseCase', () => {
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: GetClientUseCase;

  beforeEach(() => {
    clientRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetClientUseCase(clientRepository);
  });

  it('returns the client found by public id', async () => {
    const client = new Client(1, 'Ivan', 'Ivanov', '+79001234567', 'client-public-id');
    clientRepository.findByPublicId.mockResolvedValue(client);

    const result = await useCase.execute('client-public-id');

    expect(result).toBe(client);
  });

  it('throws NotFoundError when the client does not exist', async () => {
    clientRepository.findByPublicId.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
  });
});

import { jest } from '@jest/globals';
import type { ClientRepository } from '../../domain/client-repository.port.js';
import { Client } from '../../domain/client.entity.js';
import { CreateClientUseCase } from './create-client.use-case.js';

describe('CreateClientUseCase', () => {
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: CreateClientUseCase;

  beforeEach(() => {
    clientRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(async (client: Client) => client),
      delete: jest.fn(),
    };
    useCase = new CreateClientUseCase(clientRepository);
  });

  it('creates and saves a new client', async () => {
    const client = await useCase.execute({
      firstName: 'Ivan',
      lastName: 'Ivanov',
      phone: '+79001234567',
    });

    expect(client.firstName).toBe('Ivan');
    expect(client.phone).toBe('+79001234567');
    expect(clientRepository.save).toHaveBeenCalledTimes(1);
  });
});

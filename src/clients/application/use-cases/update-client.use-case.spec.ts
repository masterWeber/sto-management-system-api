import { jest } from '@jest/globals';
import { NotFoundError, ValidationError } from '../../../shared/domain/errors/domain-error.js';
import type { ClientRepository } from '../../domain/client-repository.port.js';
import { Client } from '../../domain/client.entity.js';
import { UpdateClientUseCase } from './update-client.use-case.js';

describe('UpdateClientUseCase', () => {
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: UpdateClientUseCase;

  beforeEach(() => {
    clientRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(async (client: Client) => client),
      delete: jest.fn(),
    };
    useCase = new UpdateClientUseCase(clientRepository);
  });

  it('updates only the provided fields', async () => {
    const client = new Client(1, 'Ivan', 'Ivanov', '+79001234567', 'client-public-id');
    clientRepository.findByPublicId.mockResolvedValue(client);

    const updated = await useCase.execute('client-public-id', { phone: '+79007654321' });

    expect(updated.phone).toBe('+79007654321');
    expect(updated.firstName).toBe('Ivan');
    expect(updated.lastName).toBe('Ivanov');
  });

  it('renames when firstName/lastName are provided', async () => {
    const client = new Client(1, 'Ivan', 'Ivanov', '+79001234567', 'client-public-id');
    clientRepository.findByPublicId.mockResolvedValue(client);

    const updated = await useCase.execute('client-public-id', { firstName: 'Petr' });

    expect(updated.firstName).toBe('Petr');
    expect(updated.lastName).toBe('Ivanov');
  });

  it('throws NotFoundError when the client does not exist', async () => {
    clientRepository.findByPublicId.mockResolvedValue(null);

    await expect(useCase.execute('missing', { phone: '+79000000000' })).rejects.toThrow(
      NotFoundError,
    );
    expect(clientRepository.save).not.toHaveBeenCalled();
  });

  it('propagates a ValidationError for an empty phone and does not save', async () => {
    const client = new Client(1, 'Ivan', 'Ivanov', '+79001234567', 'client-public-id');
    clientRepository.findByPublicId.mockResolvedValue(client);

    await expect(useCase.execute('client-public-id', { phone: '' })).rejects.toThrow(
      ValidationError,
    );
    expect(clientRepository.save).not.toHaveBeenCalled();
  });
});

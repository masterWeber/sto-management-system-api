import { jest } from '@jest/globals';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import type { ClientRepository } from '../../domain/client-repository.port.js';
import { Client } from '../../domain/client.entity.js';
import { DeleteClientUseCase } from './delete-client.use-case.js';

describe('DeleteClientUseCase', () => {
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: DeleteClientUseCase;

  beforeEach(() => {
    clientRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteClientUseCase(clientRepository);
  });

  it('deletes the client by its internal id once resolved', async () => {
    const client = new Client(7, 'Ivan', 'Ivanov', '+79001234567', 'client-public-id');
    clientRepository.findByPublicId.mockResolvedValue(client);

    await useCase.execute('client-public-id');

    expect(clientRepository.delete).toHaveBeenCalledWith(7);
  });

  it('throws NotFoundError and never deletes when the client does not exist', async () => {
    clientRepository.findByPublicId.mockResolvedValue(null);

    await expect(useCase.execute('missing')).rejects.toThrow(NotFoundError);
    expect(clientRepository.delete).not.toHaveBeenCalled();
  });
});

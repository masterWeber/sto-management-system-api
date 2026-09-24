import { jest } from '@jest/globals';
import type { ClientRepository } from '../../../clients/domain/client-repository.port.js';
import { Client } from '../../../clients/domain/client.entity.js';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import type { CarRepository } from '../../domain/car-repository.port.js';
import { Car } from '../../domain/car.entity.js';
import { GetCarUseCase } from './get-car.use-case.js';

describe('GetCarUseCase', () => {
  const car = new Car(1, 'Toyota', 2020, 'A123BC77', undefined, 42, 'car-public-id');
  const client = new Client(42, 'Ivan', 'Ivanov', '+79001234567', 'client-public-id');

  let carRepository: jest.Mocked<CarRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: GetCarUseCase;

  beforeEach(() => {
    carRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    clientRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetCarUseCase(carRepository, clientRepository);
  });

  it('returns the car together with its owning client public id', async () => {
    carRepository.findByPublicId.mockResolvedValue(car);
    clientRepository.findById.mockResolvedValue(client);

    const view = await useCase.execute('car-public-id');

    expect(carRepository.findByPublicId).toHaveBeenCalledWith('car-public-id');
    expect(clientRepository.findById).toHaveBeenCalledWith(42);
    expect(view.car).toBe(car);
    expect(view.clientPublicId).toBe('client-public-id');
  });

  it('throws NotFoundError when the car does not exist', async () => {
    carRepository.findByPublicId.mockResolvedValue(null);

    await expect(useCase.execute('missing-car')).rejects.toThrow(NotFoundError);
    expect(clientRepository.findById).not.toHaveBeenCalled();
  });
});

import { jest } from '@jest/globals';
import type { ClientRepository } from '../../../clients/domain/client-repository.port.js';
import { Client } from '../../../clients/domain/client.entity.js';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import type { CarRepository } from '../../domain/car-repository.port.js';
import { Car } from '../../domain/car.entity.js';
import { CreateCarUseCase } from './create-car.use-case.js';

describe('CreateCarUseCase', () => {
  const client = new Client(42, 'Ivan', 'Ivanov', '+79001234567', 'client-public-id');

  let carRepository: jest.Mocked<CarRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: CreateCarUseCase;

  beforeEach(() => {
    carRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(async (car: Car) => car),
      delete: jest.fn(),
    };
    clientRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn().mockResolvedValue(client),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateCarUseCase(carRepository, clientRepository);
  });

  it('resolves the client by public id and saves the car with the internal client id', async () => {
    const view = await useCase.execute({
      make: 'Toyota',
      year: 2020,
      licensePlate: 'A123BC77',
      clientId: 'client-public-id',
    });

    expect(clientRepository.findByPublicId).toHaveBeenCalledWith('client-public-id');
    expect(carRepository.save).toHaveBeenCalledTimes(1);
    const savedCar = carRepository.save.mock.calls[0][0];
    expect(savedCar.clientId).toBe(42);
    expect(view.car.licensePlate).toBe('A123BC77');
    expect(view.clientPublicId).toBe('client-public-id');
  });

  it('throws NotFoundError and never saves when the client public id does not resolve', async () => {
    clientRepository.findByPublicId.mockResolvedValue(null);

    await expect(
      useCase.execute({
        make: 'Toyota',
        year: 2020,
        licensePlate: 'A123BC77',
        clientId: 'missing-client',
      }),
    ).rejects.toThrow(NotFoundError);
    expect(carRepository.save).not.toHaveBeenCalled();
  });
});

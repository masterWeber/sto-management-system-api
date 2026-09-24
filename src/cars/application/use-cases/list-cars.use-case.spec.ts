import { jest } from '@jest/globals';
import type { ClientRepository } from '../../../clients/domain/client-repository.port.js';
import { Client } from '../../../clients/domain/client.entity.js';
import type { CarRepository } from '../../domain/car-repository.port.js';
import { Car } from '../../domain/car.entity.js';
import { ListCarsUseCase } from './list-cars.use-case.js';

describe('ListCarsUseCase', () => {
  let carRepository: jest.Mocked<CarRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: ListCarsUseCase;

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
    useCase = new ListCarsUseCase(carRepository, clientRepository);
  });

  it('passes filters through and resolves each returned car client public id', async () => {
    const carA = new Car(1, 'Toyota', 2020, 'A123BC77', undefined, 42, 'car-a');
    const carB = new Car(2, 'Kia', 2019, 'B222CC77', undefined, 43, 'car-b');
    carRepository.findAll.mockResolvedValue({ items: [carA, carB], total: 2, page: 1, limit: 20 });
    clientRepository.findById.mockImplementation(async (id) =>
      id === 42
        ? new Client(42, 'Ivan', 'Ivanov', '+79001234567', 'client-42')
        : new Client(43, 'Petr', 'Petrov', '+79007654321', 'client-43'),
    );

    const result = await useCase.execute(
      { licensePlate: 'A123' },
      { page: 1, limit: 20 },
    );

    expect(carRepository.findAll).toHaveBeenCalledWith(
      { licensePlate: 'A123', clientId: undefined },
      { page: 1, limit: 20 },
    );
    expect(result.items).toEqual([
      { car: carA, clientPublicId: 'client-42' },
      { car: carB, clientPublicId: 'client-43' },
    ]);
  });

  it('resolves the client filter public id to an internal id before querying cars', async () => {
    const client = new Client(42, 'Ivan', 'Ivanov', '+79001234567', 'client-42');
    clientRepository.findByPublicId.mockResolvedValue(client);
    carRepository.findAll.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20 });

    await useCase.execute({ clientId: 'client-42' }, { page: 1, limit: 20 });

    expect(clientRepository.findByPublicId).toHaveBeenCalledWith('client-42');
    expect(carRepository.findAll).toHaveBeenCalledWith(
      { licensePlate: undefined, clientId: 42 },
      { page: 1, limit: 20 },
    );
  });

  it('short-circuits to an empty page when the client filter does not resolve', async () => {
    clientRepository.findByPublicId.mockResolvedValue(null);

    const result = await useCase.execute({ clientId: 'missing-client' }, { page: 1, limit: 20 });

    expect(result).toEqual({ items: [], total: 0, page: 1, limit: 20 });
    expect(carRepository.findAll).not.toHaveBeenCalled();
  });

  it('looks up each distinct owning client only once per page', async () => {
    const carA = new Car(1, 'Toyota', 2020, 'A123BC77', undefined, 42, 'car-a');
    const carB = new Car(2, 'Kia', 2019, 'B222CC77', undefined, 42, 'car-b');
    carRepository.findAll.mockResolvedValue({ items: [carA, carB], total: 2, page: 1, limit: 20 });
    clientRepository.findById.mockResolvedValue(
      new Client(42, 'Ivan', 'Ivanov', '+79001234567', 'client-42'),
    );

    await useCase.execute({}, { page: 1, limit: 20 });

    expect(clientRepository.findById).toHaveBeenCalledTimes(1);
  });
});

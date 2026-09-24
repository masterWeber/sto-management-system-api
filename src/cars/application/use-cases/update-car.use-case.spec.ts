import { jest } from '@jest/globals';
import type { ClientRepository } from '../../../clients/domain/client-repository.port.js';
import { Client } from '../../../clients/domain/client.entity.js';
import { NotFoundError, ValidationError } from '../../../shared/domain/errors/domain-error.js';
import type { CarRepository } from '../../domain/car-repository.port.js';
import { Car } from '../../domain/car.entity.js';
import { UpdateCarUseCase } from './update-car.use-case.js';

describe('UpdateCarUseCase', () => {
  const client = new Client(42, 'Ivan', 'Ivanov', '+79001234567', 'client-public-id');

  let carRepository: jest.Mocked<CarRepository>;
  let clientRepository: jest.Mocked<ClientRepository>;
  let useCase: UpdateCarUseCase;

  beforeEach(() => {
    carRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(async (car: Car) => car),
      delete: jest.fn(),
    };
    clientRepository = {
      findById: jest.fn().mockResolvedValue(client),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new UpdateCarUseCase(carRepository, clientRepository);
  });

  it('applies only the provided fields and returns the resolved client public id', async () => {
    const car = new Car(1, 'Toyota', 2020, 'A123BC77', 'VIN1', 42, 'car-public-id');
    carRepository.findByPublicId.mockResolvedValue(car);

    const view = await useCase.execute('car-public-id', { year: 2021 });

    expect(view.car.year).toBe(2021);
    expect(view.car.make).toBe('Toyota');
    expect(view.clientPublicId).toBe('client-public-id');
    expect(carRepository.save).toHaveBeenCalledWith(car);
  });

  it('throws NotFoundError when the car does not exist', async () => {
    carRepository.findByPublicId.mockResolvedValue(null);

    await expect(useCase.execute('missing-car', { year: 2021 })).rejects.toThrow(NotFoundError);
    expect(carRepository.save).not.toHaveBeenCalled();
  });

  it('propagates a ValidationError for an invalid license plate and does not save', async () => {
    const car = new Car(1, 'Toyota', 2020, 'A123BC77', undefined, 42, 'car-public-id');
    carRepository.findByPublicId.mockResolvedValue(car);

    await expect(useCase.execute('car-public-id', { licensePlate: '' })).rejects.toThrow(
      ValidationError,
    );
    expect(carRepository.save).not.toHaveBeenCalled();
  });
});

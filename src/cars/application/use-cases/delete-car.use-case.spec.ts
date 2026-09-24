import { jest } from '@jest/globals';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import type { CarRepository } from '../../domain/car-repository.port.js';
import { Car } from '../../domain/car.entity.js';
import { DeleteCarUseCase } from './delete-car.use-case.js';

describe('DeleteCarUseCase', () => {
  let carRepository: jest.Mocked<CarRepository>;
  let useCase: DeleteCarUseCase;

  beforeEach(() => {
    carRepository = {
      findById: jest.fn(),
      findByPublicId: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteCarUseCase(carRepository);
  });

  it('deletes the car by its internal id once resolved', async () => {
    const car = new Car(7, 'Toyota', 2020, 'A123BC77', undefined, 42, 'car-public-id');
    carRepository.findByPublicId.mockResolvedValue(car);

    await useCase.execute('car-public-id');

    expect(carRepository.delete).toHaveBeenCalledWith(7);
  });

  it('throws NotFoundError and never deletes when the car does not exist', async () => {
    carRepository.findByPublicId.mockResolvedValue(null);

    await expect(useCase.execute('missing-car')).rejects.toThrow(NotFoundError);
    expect(carRepository.delete).not.toHaveBeenCalled();
  });
});

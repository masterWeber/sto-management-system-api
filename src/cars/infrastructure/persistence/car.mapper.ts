import { Car } from '../../domain/car.entity.js';
import { CarOrmEntity } from './car.orm-entity.js';

export class CarMapper {
  static toDomain(orm: CarOrmEntity): Car {
    return new Car(orm.id, orm.make, orm.year, orm.licensePlate, orm.vin, orm.clientId, orm.publicId);
  }

  static toPersistence(car: Car): CarOrmEntity {
    const orm = new CarOrmEntity();
    if (car.id !== undefined) orm.id = car.id;
    orm.publicId = car.publicId;
    orm.make = car.make;
    orm.year = car.year;
    orm.licensePlate = car.licensePlate;
    orm.vin = car.vin;
    orm.clientId = car.clientId;
    return orm;
  }
}

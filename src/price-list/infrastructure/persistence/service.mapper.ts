import { Money } from '../../../shared/domain/money.vo.js';
import { Service } from '../../domain/service.entity.js';
import { ServiceOrmEntity } from './service.orm-entity.js';

export class ServiceMapper {
  static toDomain(orm: ServiceOrmEntity): Service {
    return new Service(
      orm.id,
      orm.name,
      Money.ofKopecks(orm.priceKopecks),
      orm.categoryId,
      orm.publicId,
    );
  }

  static toPersistence(service: Service): ServiceOrmEntity {
    const orm = new ServiceOrmEntity();
    if (service.id !== undefined) orm.id = service.id;
    orm.publicId = service.publicId;
    orm.name = service.name;
    orm.priceKopecks = service.price.toKopecks();
    orm.categoryId = service.categoryId;
    return orm;
  }
}

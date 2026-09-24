import { ServiceCategory } from '../../domain/service-category.entity.js';
import { ServiceCategoryOrmEntity } from './service-category.orm-entity.js';

export class ServiceCategoryMapper {
  static toDomain(orm: ServiceCategoryOrmEntity): ServiceCategory {
    return new ServiceCategory(orm.id, orm.name, orm.publicId);
  }

  static toPersistence(category: ServiceCategory): ServiceCategoryOrmEntity {
    const orm = new ServiceCategoryOrmEntity();
    if (category.id !== undefined) orm.id = category.id;
    orm.publicId = category.publicId;
    orm.name = category.name;
    return orm;
  }
}

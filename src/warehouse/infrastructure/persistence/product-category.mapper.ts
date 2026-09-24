import { ProductCategory } from '../../domain/product-category.entity.js';
import { ProductCategoryOrmEntity } from './product-category.orm-entity.js';

export class ProductCategoryMapper {
  static toDomain(orm: ProductCategoryOrmEntity): ProductCategory {
    return new ProductCategory(orm.id, orm.name, orm.publicId);
  }

  static toPersistence(category: ProductCategory): ProductCategoryOrmEntity {
    const orm = new ProductCategoryOrmEntity();
    if (category.id !== undefined) orm.id = category.id;
    orm.publicId = category.publicId;
    orm.name = category.name;
    return orm;
  }
}

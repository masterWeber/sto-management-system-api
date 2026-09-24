import { Product } from '../../domain/product.entity.js';
import { ProductOrmEntity } from './product.orm-entity.js';

export class ProductMapper {
  static toDomain(orm: ProductOrmEntity): Product {
    return new Product(orm.id, orm.name, orm.sku, orm.quantity, orm.categoryId, orm.publicId);
  }

  static toPersistence(product: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    if (product.id !== undefined) orm.id = product.id;
    orm.publicId = product.publicId;
    orm.name = product.name;
    orm.sku = product.sku;
    orm.quantity = product.quantity;
    orm.categoryId = product.categoryId;
    return orm;
  }
}

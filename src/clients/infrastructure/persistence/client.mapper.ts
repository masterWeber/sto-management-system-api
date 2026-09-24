import { Client } from '../../domain/client.entity.js';
import { ClientOrmEntity } from './client.orm-entity.js';

export class ClientMapper {
  static toDomain(orm: ClientOrmEntity): Client {
    return new Client(orm.id, orm.firstName, orm.lastName, orm.phone, orm.publicId);
  }

  static toPersistence(client: Client): ClientOrmEntity {
    const orm = new ClientOrmEntity();
    if (client.id !== undefined) orm.id = client.id;
    orm.publicId = client.publicId;
    orm.firstName = client.firstName;
    orm.lastName = client.lastName;
    orm.phone = client.phone;
    return orm;
  }
}

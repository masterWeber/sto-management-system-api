import { StaffUser } from '../../domain/staff-user.entity.js';
import { StaffUserOrmEntity } from './staff-user.orm-entity.js';

export class StaffUserMapper {
  static toDomain(orm: StaffUserOrmEntity): StaffUser {
    return new StaffUser(
      orm.id,
      orm.fullName,
      orm.login,
      orm.passwordHash,
      orm.role,
      orm.isActive,
      orm.publicId,
    );
  }

  static toPersistence(staffUser: StaffUser): StaffUserOrmEntity {
    const orm = new StaffUserOrmEntity();
    if (staffUser.id !== undefined) orm.id = staffUser.id;
    orm.publicId = staffUser.publicId;
    orm.fullName = staffUser.fullName;
    orm.login = staffUser.login;
    orm.passwordHash = staffUser.passwordHash;
    orm.role = staffUser.role;
    orm.isActive = staffUser.isActive;
    return orm;
  }
}

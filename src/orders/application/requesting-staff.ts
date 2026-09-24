import type { Role } from '../../shared/domain/role.js';

export interface RequestingStaff {
  role: Role;
  staffPublicId: string;
}

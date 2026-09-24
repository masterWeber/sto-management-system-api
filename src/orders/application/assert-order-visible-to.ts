import { NotFoundError } from '../../shared/domain/errors/domain-error.js';
import { Role } from '../../shared/domain/role.js';
import type { StaffRepository } from '../../staff/domain/staff-repository.port.js';
import type { Order } from '../domain/order.entity.js';
import type { RequestingStaff } from './requesting-staff.js';

export async function assertOrderVisibleTo(
  order: Order,
  requester: RequestingStaff,
  staffRepository: StaffRepository,
): Promise<void> {
  if (requester.role !== Role.MASTER) return;
  const staff = await staffRepository.findByPublicId(requester.staffPublicId);
  if (!staff || order.assignedMasterId !== staff.id) {
    throw new NotFoundError('Order', order.publicId);
  }
}

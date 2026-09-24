import type { Order } from '../domain/order.entity.js';

export interface OrderView {
  order: Order;
  clientPublicId: string;
  carPublicId: string;
  assignedMasterPublicId: string | null;
}

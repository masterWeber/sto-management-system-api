import { ConflictError } from '../../../shared/domain/errors/domain-error.js';
import type { OrderStatus } from '../order-status.js';

export class InvalidOrderTransitionError extends ConflictError {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Cannot transition order from ${from} to ${to}`);
  }
}

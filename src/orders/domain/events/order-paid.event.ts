import type { DomainEvent } from '../../../shared/domain/domain-event.js';

export class OrderPaidEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(public readonly orderId: number) {}
}

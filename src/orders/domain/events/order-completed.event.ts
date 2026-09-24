import type { DomainEvent } from '../../../shared/domain/domain-event.js';

export class OrderCompletedEvent implements DomainEvent {
  readonly occurredAt = new Date();

  constructor(public readonly orderId: number) {}
}

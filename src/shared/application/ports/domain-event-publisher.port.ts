import type { DomainEvent } from '../../domain/domain-event.js';

export const DOMAIN_EVENT_PUBLISHER = Symbol('DOMAIN_EVENT_PUBLISHER');

export interface DomainEventPublisher {
  publish(event: DomainEvent): void;
  subscribe<T extends DomainEvent>(eventName: string, handler: (event: T) => void): void;
}

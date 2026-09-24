import type { DomainEvent } from './domain-event.js';

export abstract class AggregateRoot {
  #domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this.#domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = this.#domainEvents;
    this.#domainEvents = [];
    return events;
  }
}

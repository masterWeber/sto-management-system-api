import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'node:events';
import type { DomainEvent } from '../domain/domain-event.js';
import type { DomainEventPublisher } from '../application/ports/domain-event-publisher.port.js';

@Injectable()
export class NodeEventEmitterPublisher implements DomainEventPublisher {
  private readonly emitter = new EventEmitter();

  publish(event: DomainEvent): void {
    this.emitter.emit(event.constructor.name, event);
  }

  subscribe<T extends DomainEvent>(eventName: string, handler: (event: T) => void): void {
    this.emitter.on(eventName, handler as (event: DomainEvent) => void);
  }
}

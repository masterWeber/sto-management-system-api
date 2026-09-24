import { randomUUID } from 'node:crypto';
import { AggregateRoot } from '../../shared/domain/aggregate-root.js';
import { ConflictError, NotFoundError } from '../../shared/domain/errors/domain-error.js';
import { Money } from '../../shared/domain/money.vo.js';
import { OrderCompletedEvent } from './events/order-completed.event.js';
import { OrderPaidEvent } from './events/order-paid.event.js';
import { InvalidOrderTransitionError } from './errors/invalid-order-transition.error.js';
import { OrderItem } from './order-item.entity.js';
import { ALLOWED_TRANSITIONS, type OrderStatus } from './order-status.js';

export interface AddOrderItemInput {
  serviceId?: number;
  name: string;
  price: Money;
}

export interface TransitionOptions {
  adminOverride?: boolean;
}

export class Order extends AggregateRoot {
  private itemsList: OrderItem[];

  constructor(
    public readonly id: number | undefined,
    public readonly clientId: number,
    public readonly carId: number,
    public scheduledAt: Date,
    public status: OrderStatus = 'RECEIVED',
    public comment: string | undefined = undefined,
    public assignedMasterId: number | undefined = undefined,
    public completedAt: Date | undefined = undefined,
    public paidAt: Date | undefined = undefined,
    items: OrderItem[] = [],
    public readonly publicId: string = randomUUID(),
  ) {
    super();
    this.itemsList = items;
  }

  get items(): readonly OrderItem[] {
    return this.itemsList;
  }

  addItem(input: AddOrderItemInput): OrderItem {
    this.assertNotPaid();
    const item = new OrderItem(undefined, input.serviceId, input.name, input.price);
    this.itemsList.push(item);
    return item;
  }

  removeItem(itemPublicId: string): void {
    this.assertNotPaid();
    const index = this.itemsList.findIndex((item) => item.publicId === itemPublicId);
    if (index === -1) throw new NotFoundError('OrderItem', itemPublicId);
    this.itemsList.splice(index, 1);
  }

  total(): Money {
    return this.itemsList.reduce((sum, item) => sum.add(item.price), Money.zero());
  }

  assignMaster(masterId: number | undefined): void {
    this.assignedMasterId = masterId;
  }

  updateDetails(input: { scheduledAt?: Date; comment?: string }): void {
    if (input.scheduledAt !== undefined) this.scheduledAt = input.scheduledAt;
    if (input.comment !== undefined) this.comment = input.comment;
  }

  transitionTo(target: OrderStatus, options: TransitionOptions = {}): void {
    if (!options.adminOverride && !ALLOWED_TRANSITIONS[this.status].includes(target)) {
      throw new InvalidOrderTransitionError(this.status, target);
    }

    this.status = target;
    if (target === 'COMPLETED') {
      this.completedAt = new Date();
      this.addDomainEvent(new OrderCompletedEvent(this.id!));
    }
    if (target === 'PAID') {
      this.paidAt = new Date();
      this.addDomainEvent(new OrderPaidEvent(this.id!));
    }
  }

  private assertNotPaid(): void {
    if (this.status === 'PAID') {
      throw new ConflictError('Cannot modify items of a paid order');
    }
  }
}

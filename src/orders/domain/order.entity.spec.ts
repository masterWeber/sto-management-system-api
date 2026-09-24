import { ConflictError, NotFoundError } from '../../shared/domain/errors/domain-error.js';
import { Money } from '../../shared/domain/money.vo.js';
import { OrderCompletedEvent } from './events/order-completed.event.js';
import { OrderPaidEvent } from './events/order-paid.event.js';
import { InvalidOrderTransitionError } from './errors/invalid-order-transition.error.js';
import { Order } from './order.entity.js';

function createOrder(id = 1): Order {
  return new Order(id, 10, 20, new Date('2026-01-01T10:00:00Z'));
}

describe('Order', () => {
  it('starts in RECEIVED status with no items', () => {
    const order = createOrder();
    expect(order.status).toBe('RECEIVED');
    expect(order.items).toEqual([]);
    expect(order.total().toKopecks()).toBe(0);
  });

  describe('addItem / removeItem', () => {
    it('adds an item and includes it in the total', () => {
      const order = createOrder();
      order.addItem({ serviceId: 1, name: 'Oil change', price: Money.ofKopecks(150000) });
      order.addItem({ name: 'Custom repair', price: Money.ofKopecks(50000) });

      expect(order.items).toHaveLength(2);
      expect(order.total().toKopecks()).toBe(200000);
    });

    it('removes an item by its public id', () => {
      const order = createOrder();
      const item = order.addItem({ name: 'Oil change', price: Money.ofKopecks(150000) });

      order.removeItem(item.publicId);

      expect(order.items).toHaveLength(0);
    });

    it('throws NotFoundError when removing an unknown item', () => {
      const order = createOrder();
      expect(() => order.removeItem('missing-item')).toThrow(NotFoundError);
    });

    it('rejects modifying items once the order is paid', () => {
      const order = createOrder();
      order.transitionTo('IN_PROGRESS');
      order.transitionTo('COMPLETED');
      order.transitionTo('PAID');

      expect(() => order.addItem({ name: 'X', price: Money.ofKopecks(100) })).toThrow(
        ConflictError,
      );
    });
  });

  describe('transitionTo', () => {
    it('follows the forward-only sequence', () => {
      const order = createOrder();
      order.transitionTo('IN_PROGRESS');
      expect(order.status).toBe('IN_PROGRESS');
      order.transitionTo('COMPLETED');
      expect(order.status).toBe('COMPLETED');
      expect(order.completedAt).toBeInstanceOf(Date);
      order.transitionTo('PAID');
      expect(order.status).toBe('PAID');
      expect(order.paidAt).toBeInstanceOf(Date);
    });

    it('rejects skipping a step', () => {
      const order = createOrder();
      expect(() => order.transitionTo('COMPLETED')).toThrow(InvalidOrderTransitionError);
    });

    it('rejects moving backward', () => {
      const order = createOrder();
      order.transitionTo('IN_PROGRESS');
      expect(() => order.transitionTo('RECEIVED')).toThrow(InvalidOrderTransitionError);
    });

    it('rejects any transition once PAID', () => {
      const order = createOrder();
      order.transitionTo('IN_PROGRESS');
      order.transitionTo('COMPLETED');
      order.transitionTo('PAID');
      expect(() => order.transitionTo('RECEIVED')).toThrow(InvalidOrderTransitionError);
    });

    it('allows an admin override to skip steps', () => {
      const order = createOrder();
      order.transitionTo('COMPLETED', { adminOverride: true });
      expect(order.status).toBe('COMPLETED');
    });

    it('emits OrderCompletedEvent on transition to COMPLETED', () => {
      const order = createOrder(7);
      order.transitionTo('IN_PROGRESS');
      order.transitionTo('COMPLETED');

      const events = order.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderCompletedEvent);
      expect((events[0] as OrderCompletedEvent).orderId).toBe(7);
    });

    it('emits OrderPaidEvent on transition to PAID', () => {
      const order = createOrder(7);
      order.transitionTo('IN_PROGRESS');
      order.transitionTo('COMPLETED');
      order.pullDomainEvents();

      order.transitionTo('PAID');

      const events = order.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderPaidEvent);
    });

    it('pullDomainEvents clears the collected events', () => {
      const order = createOrder();
      order.transitionTo('IN_PROGRESS');
      order.transitionTo('COMPLETED');

      order.pullDomainEvents();
      expect(order.pullDomainEvents()).toEqual([]);
    });
  });

  describe('assignMaster / updateDetails', () => {
    it('assigns and unassigns a master', () => {
      const order = createOrder();
      order.assignMaster(99);
      expect(order.assignedMasterId).toBe(99);
      order.assignMaster(undefined);
      expect(order.assignedMasterId).toBeUndefined();
    });

    it('updates only the provided details', () => {
      const order = createOrder();
      order.updateDetails({ comment: 'Customer waiting' });
      expect(order.comment).toBe('Customer waiting');
      expect(order.scheduledAt).toEqual(new Date('2026-01-01T10:00:00Z'));
    });
  });
});

export type OrderStatus = 'RECEIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAID';

export const ORDER_STATUSES: OrderStatus[] = ['RECEIVED', 'IN_PROGRESS', 'COMPLETED', 'PAID'];

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  RECEIVED: ['IN_PROGRESS'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: ['PAID'],
  PAID: [],
};

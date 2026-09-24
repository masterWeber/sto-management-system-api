import { IsBoolean, IsIn, IsOptional } from 'class-validator';
import { ORDER_STATUSES, type OrderStatus } from '../../domain/order-status.js';

export class TransitionOrderStatusDto {
  @IsIn(ORDER_STATUSES)
  status!: OrderStatus;

  @IsBoolean()
  @IsOptional()
  adminOverride?: boolean;
}

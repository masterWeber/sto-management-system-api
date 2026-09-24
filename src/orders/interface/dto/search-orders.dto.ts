import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/interface/dto/pagination-query.dto.js';
import { ORDER_STATUSES, type OrderStatus } from '../../domain/order-status.js';

export class SearchOrdersDto extends PaginationQueryDto {
  @IsIn(ORDER_STATUSES)
  @IsOptional()
  status?: OrderStatus;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsUUID()
  @IsOptional()
  carId?: string;

  @IsUUID()
  @IsOptional()
  assignedMasterId?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduledFrom?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduledTo?: Date;
}

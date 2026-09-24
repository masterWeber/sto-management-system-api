import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  clientId!: string;

  @IsUUID()
  carId!: string;

  @Type(() => Date)
  @IsDate()
  scheduledAt!: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment?: string;
}

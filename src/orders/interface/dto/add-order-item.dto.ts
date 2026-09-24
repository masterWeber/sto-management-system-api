import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class AddOrderItemDto {
  @IsUUID()
  @IsOptional()
  serviceId?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  priceKopecks?: number;
}

import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class UpdateOrderDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduledAt?: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment?: string;

  @ValidateIf((_, value) => value !== null)
  @IsUUID()
  @IsOptional()
  assignedMasterId?: string | null;
}

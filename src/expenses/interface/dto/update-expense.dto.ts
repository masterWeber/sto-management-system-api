import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateExpenseDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date?: Date;

  @IsInt()
  @IsPositive()
  @IsOptional()
  amountKopecks?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;
}

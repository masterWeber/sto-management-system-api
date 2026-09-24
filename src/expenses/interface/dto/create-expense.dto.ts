import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateExpenseDto {
  @Type(() => Date)
  @IsDate()
  date!: Date;

  @IsInt()
  @IsPositive()
  amountKopecks!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  category?: string;
}

import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

const CURRENT_YEAR = new Date().getFullYear();

export class UpdateCarDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  make?: string;

  @IsInt()
  @Min(1900)
  @Max(CURRENT_YEAR + 1)
  @IsOptional()
  year?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  licensePlate?: string;

  @IsString()
  @IsOptional()
  vin?: string;
}

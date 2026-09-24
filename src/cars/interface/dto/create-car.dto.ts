import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

const CURRENT_YEAR = new Date().getFullYear();

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  make!: string;

  @IsInt()
  @Min(1900)
  @Max(CURRENT_YEAR + 1)
  year!: number;

  @IsString()
  @IsNotEmpty()
  licensePlate!: string;

  @IsString()
  @IsOptional()
  vin?: string;

  @IsUUID()
  clientId!: string;
}

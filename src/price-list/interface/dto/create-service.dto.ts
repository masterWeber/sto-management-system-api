import { IsInt, IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsInt()
  @IsPositive()
  priceKopecks!: number;

  @IsUUID()
  categoryId!: string;
}

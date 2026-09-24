import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  sku!: string;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsUUID()
  categoryId!: string;
}

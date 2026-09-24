import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

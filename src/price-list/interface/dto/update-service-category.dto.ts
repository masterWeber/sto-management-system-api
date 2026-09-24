import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateServiceCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

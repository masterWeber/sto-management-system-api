import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/interface/dto/pagination-query.dto.js';

export class SearchProductsDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @Transform(({ value }) => (value === undefined ? undefined : value === 'true'))
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}

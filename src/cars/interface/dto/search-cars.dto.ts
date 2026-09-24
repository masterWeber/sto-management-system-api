import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../shared/interface/dto/pagination-query.dto.js';

export class SearchCarsDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  licensePlate?: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;
}

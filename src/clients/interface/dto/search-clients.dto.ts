import { IsOptional, IsString } from 'class-validator';

export class SearchClientsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

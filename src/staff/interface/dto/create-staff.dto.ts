import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../../../shared/domain/role.js';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  login!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(Role)
  role!: Role;
}

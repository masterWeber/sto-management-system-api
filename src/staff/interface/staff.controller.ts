import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '../../shared/domain/role.js';
import type { AuthenticatedRequest } from '../../shared/interface/authenticated-request.js';
import { PaginationQueryDto } from '../../shared/interface/dto/pagination-query.dto.js';
import {
  ErrorCode,
  ErrorResponseDto,
  FORBIDDEN_EXAMPLE,
  UNAUTHORIZED_EXAMPLE,
} from '../../shared/interface/dto/error-response.dto.js';
import { Roles } from '../../shared/interface/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../../shared/interface/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/interface/guards/roles.guard.js';
import { CreateStaffUseCase } from '../application/use-cases/create-staff.use-case.js';
import { DeactivateStaffUseCase } from '../application/use-cases/deactivate-staff.use-case.js';
import { GetStaffUseCase } from '../application/use-cases/get-staff.use-case.js';
import { ListStaffUseCase } from '../application/use-cases/list-staff.use-case.js';
import { UpdateStaffUseCase } from '../application/use-cases/update-staff.use-case.js';
import { CreateStaffDto } from './dto/create-staff.dto.js';
import { StaffPageResponseDto } from './dto/staff-page.response.dto.js';
import { StaffResponseDto } from './dto/staff.response.dto.js';
import { UpdateStaffDto } from './dto/update-staff.dto.js';

@ApiTags('staff')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  type: ErrorResponseDto,
  description: 'Не авторизован',
  example: UNAUTHORIZED_EXAMPLE,
})
@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
  constructor(
    private readonly createStaff: CreateStaffUseCase,
    private readonly updateStaff: UpdateStaffUseCase,
    private readonly deactivateStaff: DeactivateStaffUseCase,
    private readonly getStaff: GetStaffUseCase,
    private readonly listStaff: ListStaffUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Данные текущего авторизованного сотрудника' })
  async me(@Req() request: AuthenticatedRequest): Promise<StaffResponseDto> {
    const staffUser = await this.getStaff.execute(request.user.userId);
    return StaffResponseDto.fromDomain(staffUser);
  }

  @Get()
  @ApiOperation({ summary: 'Список сотрудников' })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Недостаточно прав',
    example: FORBIDDEN_EXAMPLE,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Некорректные параметры пагинации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['limit must not be greater than 100'],
    },
  })
  @Roles(Role.ADMIN)
  async list(@Query() pagination: PaginationQueryDto): Promise<StaffPageResponseDto> {
    const result = await this.listStaff.execute(pagination);
    return StaffPageResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить сотрудника по ID' })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Недостаточно прав',
    example: FORBIDDEN_EXAMPLE,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Сотрудник не найден',
    example: {
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'StaffUser with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
    },
  })
  @Roles(Role.ADMIN)
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<StaffResponseDto> {
    const staffUser = await this.getStaff.execute(id);
    return StaffResponseDto.fromDomain(staffUser);
  }

  @Post()
  @ApiOperation({ summary: 'Создать учётную запись сотрудника' })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Недостаточно прав',
    example: FORBIDDEN_EXAMPLE,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['password must be longer than or equal to 8 characters'],
    },
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Логин уже занят',
    example: {
      statusCode: 409,
      error: ErrorCode.CONFLICT_ERROR,
      message: 'Login "ivan" is already taken',
    },
  })
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateStaffDto): Promise<StaffResponseDto> {
    const staffUser = await this.createStaff.execute(dto);
    return StaffResponseDto.fromDomain(staffUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить ФИО или роль сотрудника' })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Недостаточно прав',
    example: FORBIDDEN_EXAMPLE,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Сотрудник не найден',
    example: {
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'StaffUser with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
    },
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['role must be a valid enum value'],
    },
  })
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStaffDto,
  ): Promise<StaffResponseDto> {
    const staffUser = await this.updateStaff.execute(id, dto);
    return StaffResponseDto.fromDomain(staffUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Деактивировать сотрудника (soft-delete)' })
  @ApiForbiddenResponse({
    type: ErrorResponseDto,
    description: 'Недостаточно прав',
    example: FORBIDDEN_EXAMPLE,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Сотрудник не найден',
    example: {
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'StaffUser with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
    },
  })
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deactivateStaff.execute(id);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../shared/domain/role.js';
import type { AuthenticatedRequest } from '../../shared/interface/authenticated-request.js';
import { Roles } from '../../shared/interface/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../../shared/interface/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/interface/guards/roles.guard.js';
import { CreateStaffUseCase } from '../application/use-cases/create-staff.use-case.js';
import { DeactivateStaffUseCase } from '../application/use-cases/deactivate-staff.use-case.js';
import { GetStaffUseCase } from '../application/use-cases/get-staff.use-case.js';
import { ListStaffUseCase } from '../application/use-cases/list-staff.use-case.js';
import { UpdateStaffUseCase } from '../application/use-cases/update-staff.use-case.js';
import { CreateStaffDto } from './dto/create-staff.dto.js';
import { StaffResponseDto } from './dto/staff.response.dto.js';
import { UpdateStaffDto } from './dto/update-staff.dto.js';

@ApiTags('staff')
@ApiBearerAuth()
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
  @Roles(Role.ADMIN)
  async list(): Promise<StaffResponseDto[]> {
    const staff = await this.listStaff.execute();
    return staff.map(StaffResponseDto.fromDomain);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить сотрудника по ID' })
  @Roles(Role.ADMIN)
  async get(@Param('id', ParseIntPipe) id: number): Promise<StaffResponseDto> {
    const staffUser = await this.getStaff.execute(id);
    return StaffResponseDto.fromDomain(staffUser);
  }

  @Post()
  @ApiOperation({ summary: 'Создать учётную запись сотрудника' })
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateStaffDto): Promise<StaffResponseDto> {
    const staffUser = await this.createStaff.execute(dto);
    return StaffResponseDto.fromDomain(staffUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить ФИО или роль сотрудника' })
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStaffDto,
  ): Promise<StaffResponseDto> {
    const staffUser = await this.updateStaff.execute(id, dto);
    return StaffResponseDto.fromDomain(staffUser);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Деактивировать сотрудника (soft-delete)' })
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deactivateStaff.execute(id);
  }
}

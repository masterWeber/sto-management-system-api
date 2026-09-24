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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '../../shared/domain/role.js';
import {
  ErrorCode,
  ErrorResponseDto,
  FORBIDDEN_EXAMPLE,
  UNAUTHORIZED_EXAMPLE,
} from '../../shared/interface/dto/error-response.dto.js';
import { Roles } from '../../shared/interface/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../../shared/interface/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/interface/guards/roles.guard.js';
import { CreateServiceUseCase } from '../application/use-cases/create-service.use-case.js';
import { DeleteServiceUseCase } from '../application/use-cases/delete-service.use-case.js';
import { GetServiceUseCase } from '../application/use-cases/get-service.use-case.js';
import { ListServicesUseCase } from '../application/use-cases/list-services.use-case.js';
import { UpdateServiceUseCase } from '../application/use-cases/update-service.use-case.js';
import { CreateServiceDto } from './dto/create-service.dto.js';
import { SearchServicesDto } from './dto/search-services.dto.js';
import { ServiceResponseDto } from './dto/service.response.dto.js';
import { ServicesPageResponseDto } from './dto/services-page.response.dto.js';
import { UpdateServiceDto } from './dto/update-service.dto.js';

const SERVICE_NOT_FOUND_EXAMPLE = {
  statusCode: 404,
  error: ErrorCode.NOT_FOUND_ERROR,
  message: 'Service with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
};

@ApiTags('services')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  type: ErrorResponseDto,
  description: 'Не авторизован',
  example: UNAUTHORIZED_EXAMPLE,
})
@ApiForbiddenResponse({
  type: ErrorResponseDto,
  description: 'Недостаточно прав',
  example: FORBIDDEN_EXAMPLE,
})
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(
    private readonly createService: CreateServiceUseCase,
    private readonly updateService: UpdateServiceUseCase,
    private readonly deleteService: DeleteServiceUseCase,
    private readonly getService: GetServiceUseCase,
    private readonly listServices: ListServicesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список услуг с поиском по названию и категории' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Некорректные параметры запроса',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['limit must not be greater than 100'],
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async list(@Query() query: SearchServicesDto): Promise<ServicesPageResponseDto> {
    const { page, limit, ...filters } = query;
    const result = await this.listServices.execute(filters, { page, limit });
    return ServicesPageResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить услугу по ID' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Услуга не найдена',
    example: SERVICE_NOT_FOUND_EXAMPLE,
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<ServiceResponseDto> {
    const view = await this.getService.execute(id);
    return ServiceResponseDto.fromView(view);
  }

  @Post()
  @ApiOperation({ summary: 'Добавить услугу в прайс-лист' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: { statusCode: 400, error: ErrorCode.BAD_REQUEST, message: ['name should not be empty'] },
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Категория не найдена',
    example: {
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'ServiceCategory with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Body() dto: CreateServiceDto): Promise<ServiceResponseDto> {
    const view = await this.createService.execute(dto);
    return ServiceResponseDto.fromView(view);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить название или цену услуги' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Услуга не найдена',
    example: SERVICE_NOT_FOUND_EXAMPLE,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: { statusCode: 400, error: ErrorCode.BAD_REQUEST, message: ['name should not be empty'] },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    const view = await this.updateService.execute(id, dto);
    return ServiceResponseDto.fromView(view);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить услугу' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Услуга не найдена',
    example: SERVICE_NOT_FOUND_EXAMPLE,
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteService.execute(id);
  }
}

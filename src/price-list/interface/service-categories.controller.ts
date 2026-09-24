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
  ApiConflictResponse,
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
import { PaginationQueryDto } from '../../shared/interface/dto/pagination-query.dto.js';
import { Roles } from '../../shared/interface/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../../shared/interface/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/interface/guards/roles.guard.js';
import { CreateServiceCategoryUseCase } from '../application/use-cases/create-service-category.use-case.js';
import { DeleteServiceCategoryUseCase } from '../application/use-cases/delete-service-category.use-case.js';
import { GetServiceCategoryUseCase } from '../application/use-cases/get-service-category.use-case.js';
import { ListServiceCategoriesUseCase } from '../application/use-cases/list-service-categories.use-case.js';
import { UpdateServiceCategoryUseCase } from '../application/use-cases/update-service-category.use-case.js';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto.js';
import { ServiceCategoriesPageResponseDto } from './dto/service-categories-page.response.dto.js';
import { ServiceCategoryResponseDto } from './dto/service-category.response.dto.js';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto.js';

const CATEGORY_NOT_FOUND_EXAMPLE = {
  statusCode: 404,
  error: ErrorCode.NOT_FOUND_ERROR,
  message: 'ServiceCategory with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
};

@ApiTags('service-categories')
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
@Controller('service-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceCategoriesController {
  constructor(
    private readonly createCategory: CreateServiceCategoryUseCase,
    private readonly updateCategory: UpdateServiceCategoryUseCase,
    private readonly deleteCategory: DeleteServiceCategoryUseCase,
    private readonly getCategory: GetServiceCategoryUseCase,
    private readonly listCategories: ListServiceCategoriesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список категорий услуг' })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async list(@Query() pagination: PaginationQueryDto): Promise<ServiceCategoriesPageResponseDto> {
    const result = await this.listCategories.execute(pagination);
    return ServiceCategoriesPageResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию услуг по ID' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Категория не найдена',
    example: CATEGORY_NOT_FOUND_EXAMPLE,
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<ServiceCategoryResponseDto> {
    const category = await this.getCategory.execute(id);
    return ServiceCategoryResponseDto.fromDomain(category);
  }

  @Post()
  @ApiOperation({ summary: 'Создать категорию услуг' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: { statusCode: 400, error: ErrorCode.BAD_REQUEST, message: ['name should not be empty'] },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Body() dto: CreateServiceCategoryDto): Promise<ServiceCategoryResponseDto> {
    const category = await this.createCategory.execute(dto);
    return ServiceCategoryResponseDto.fromDomain(category);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Переименовать категорию услуг' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Категория не найдена',
    example: CATEGORY_NOT_FOUND_EXAMPLE,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: { statusCode: 400, error: ErrorCode.BAD_REQUEST, message: ['name should not be empty'] },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategoryResponseDto> {
    const category = await this.updateCategory.execute(id, dto.name);
    return ServiceCategoryResponseDto.fromDomain(category);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить категорию услуг' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Категория не найдена',
    example: CATEGORY_NOT_FOUND_EXAMPLE,
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'У категории есть связанные услуги',
    example: {
      statusCode: 409,
      error: ErrorCode.CONFLICT_ERROR,
      message: 'Service category has associated services and cannot be deleted',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteCategory.execute(id);
  }
}

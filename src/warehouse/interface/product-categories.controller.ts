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
import { CreateProductCategoryUseCase } from '../application/use-cases/create-product-category.use-case.js';
import { DeleteProductCategoryUseCase } from '../application/use-cases/delete-product-category.use-case.js';
import { GetProductCategoryUseCase } from '../application/use-cases/get-product-category.use-case.js';
import { ListProductCategoriesUseCase } from '../application/use-cases/list-product-categories.use-case.js';
import { UpdateProductCategoryUseCase } from '../application/use-cases/update-product-category.use-case.js';
import { CreateProductCategoryDto } from './dto/create-product-category.dto.js';
import { ProductCategoriesPageResponseDto } from './dto/product-categories-page.response.dto.js';
import { ProductCategoryResponseDto } from './dto/product-category.response.dto.js';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto.js';

const CATEGORY_NOT_FOUND_EXAMPLE = {
  statusCode: 404,
  error: ErrorCode.NOT_FOUND_ERROR,
  message: 'ProductCategory with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
};

@ApiTags('product-categories')
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
@Controller('product-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductCategoriesController {
  constructor(
    private readonly createCategory: CreateProductCategoryUseCase,
    private readonly updateCategory: UpdateProductCategoryUseCase,
    private readonly deleteCategory: DeleteProductCategoryUseCase,
    private readonly getCategory: GetProductCategoryUseCase,
    private readonly listCategories: ListProductCategoriesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список категорий товаров' })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async list(@Query() pagination: PaginationQueryDto): Promise<ProductCategoriesPageResponseDto> {
    const result = await this.listCategories.execute(pagination);
    return ProductCategoriesPageResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию товаров по ID' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Категория не найдена',
    example: CATEGORY_NOT_FOUND_EXAMPLE,
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<ProductCategoryResponseDto> {
    const category = await this.getCategory.execute(id);
    return ProductCategoryResponseDto.fromDomain(category);
  }

  @Post()
  @ApiOperation({ summary: 'Создать категорию товаров' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: { statusCode: 400, error: ErrorCode.BAD_REQUEST, message: ['name should not be empty'] },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Body() dto: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
    const category = await this.createCategory.execute(dto);
    return ProductCategoryResponseDto.fromDomain(category);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Переименовать категорию товаров' })
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
    @Body() dto: UpdateProductCategoryDto,
  ): Promise<ProductCategoryResponseDto> {
    const category = await this.updateCategory.execute(id, dto.name);
    return ProductCategoryResponseDto.fromDomain(category);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить категорию товаров' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Категория не найдена',
    example: CATEGORY_NOT_FOUND_EXAMPLE,
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'У категории есть связанные товары',
    example: {
      statusCode: 409,
      error: ErrorCode.CONFLICT_ERROR,
      message: 'Product category has associated products and cannot be deleted',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteCategory.execute(id);
  }
}

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
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case.js';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case.js';
import { GetProductUseCase } from '../application/use-cases/get-product.use-case.js';
import { ListProductsUseCase } from '../application/use-cases/list-products.use-case.js';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductResponseDto } from './dto/product.response.dto.js';
import { ProductsPageResponseDto } from './dto/products-page.response.dto.js';
import { SearchProductsDto } from './dto/search-products.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

const PRODUCT_NOT_FOUND_EXAMPLE = {
  statusCode: 404,
  error: ErrorCode.NOT_FOUND_ERROR,
  message: 'Product with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
};

@ApiTags('products')
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
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(
    private readonly createProduct: CreateProductUseCase,
    private readonly updateProduct: UpdateProductUseCase,
    private readonly deleteProduct: DeleteProductUseCase,
    private readonly getProduct: GetProductUseCase,
    private readonly listProducts: ListProductsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список товаров с поиском по названию, артикулу и наличию' })
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
  async list(@Query() query: SearchProductsDto): Promise<ProductsPageResponseDto> {
    const { page, limit, ...filters } = query;
    const result = await this.listProducts.execute(filters, { page, limit });
    return ProductsPageResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Товар не найден',
    example: PRODUCT_NOT_FOUND_EXAMPLE,
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<ProductResponseDto> {
    const view = await this.getProduct.execute(id);
    return ProductResponseDto.fromView(view);
  }

  @Post()
  @ApiOperation({ summary: 'Добавить товар на склад' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: { statusCode: 400, error: ErrorCode.BAD_REQUEST, message: ['sku should not be empty'] },
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Категория не найдена',
    example: {
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'ProductCategory with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
    const view = await this.createProduct.execute(dto);
    return ProductResponseDto.fromView(view);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные или количество товара' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Товар не найден',
    example: PRODUCT_NOT_FOUND_EXAMPLE,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: { statusCode: 400, error: ErrorCode.BAD_REQUEST, message: ['quantity must not be less than 0'] },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const view = await this.updateProduct.execute(id, dto);
    return ProductResponseDto.fromView(view);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить товар' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Товар не найден',
    example: PRODUCT_NOT_FOUND_EXAMPLE,
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteProduct.execute(id);
  }
}

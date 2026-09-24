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
import { CreateCarUseCase } from '../application/use-cases/create-car.use-case.js';
import { DeleteCarUseCase } from '../application/use-cases/delete-car.use-case.js';
import { GetCarUseCase } from '../application/use-cases/get-car.use-case.js';
import { ListCarsUseCase } from '../application/use-cases/list-cars.use-case.js';
import { UpdateCarUseCase } from '../application/use-cases/update-car.use-case.js';
import { CarResponseDto } from './dto/car.response.dto.js';
import { CarsPageResponseDto } from './dto/cars-page.response.dto.js';
import { CreateCarDto } from './dto/create-car.dto.js';
import { SearchCarsDto } from './dto/search-cars.dto.js';
import { UpdateCarDto } from './dto/update-car.dto.js';

const CAR_NOT_FOUND_EXAMPLE = {
  statusCode: 404,
  error: ErrorCode.NOT_FOUND_ERROR,
  message: 'Car with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
};

@ApiTags('cars')
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
@Controller('cars')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CarsController {
  constructor(
    private readonly createCar: CreateCarUseCase,
    private readonly updateCar: UpdateCarUseCase,
    private readonly deleteCar: DeleteCarUseCase,
    private readonly getCar: GetCarUseCase,
    private readonly listCars: ListCarsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список автомобилей с поиском по госномеру и клиенту' })
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
  async list(@Query() query: SearchCarsDto): Promise<CarsPageResponseDto> {
    const { page, limit, ...filters } = query;
    const result = await this.listCars.execute(filters, { page, limit });
    return CarsPageResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить автомобиль по ID' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Автомобиль не найден',
    example: CAR_NOT_FOUND_EXAMPLE,
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<CarResponseDto> {
    const view = await this.getCar.execute(id);
    return CarResponseDto.fromView(view);
  }

  @Post()
  @ApiOperation({ summary: 'Добавить автомобиль' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['licensePlate should not be empty'],
    },
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Клиент не найден',
    example: {
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'Client with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Body() dto: CreateCarDto): Promise<CarResponseDto> {
    const view = await this.createCar.execute(dto);
    return CarResponseDto.fromView(view);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные автомобиля' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Автомобиль не найден',
    example: CAR_NOT_FOUND_EXAMPLE,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['licensePlate should not be empty'],
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCarDto,
  ): Promise<CarResponseDto> {
    const view = await this.updateCar.execute(id, dto);
    return CarResponseDto.fromView(view);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить автомобиль' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Автомобиль не найден',
    example: CAR_NOT_FOUND_EXAMPLE,
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteCar.execute(id);
  }
}

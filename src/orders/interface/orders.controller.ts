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
import {
  ErrorCode,
  ErrorResponseDto,
  FORBIDDEN_EXAMPLE,
  UNAUTHORIZED_EXAMPLE,
} from '../../shared/interface/dto/error-response.dto.js';
import { Roles } from '../../shared/interface/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../../shared/interface/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/interface/guards/roles.guard.js';
import { AddOrderItemUseCase } from '../application/use-cases/add-order-item.use-case.js';
import { CreateOrderUseCase } from '../application/use-cases/create-order.use-case.js';
import { DeleteOrderUseCase } from '../application/use-cases/delete-order.use-case.js';
import { GetOrderUseCase } from '../application/use-cases/get-order.use-case.js';
import { ListOrdersUseCase } from '../application/use-cases/list-orders.use-case.js';
import { RemoveOrderItemUseCase } from '../application/use-cases/remove-order-item.use-case.js';
import { TransitionOrderStatusUseCase } from '../application/use-cases/transition-order-status.use-case.js';
import { UpdateOrderUseCase } from '../application/use-cases/update-order.use-case.js';
import { AddOrderItemDto } from './dto/add-order-item.dto.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderItemResponseDto } from './dto/order-item.response.dto.js';
import { OrderResponseDto } from './dto/order.response.dto.js';
import { OrdersPageResponseDto } from './dto/orders-page.response.dto.js';
import { SearchOrdersDto } from './dto/search-orders.dto.js';
import { TransitionOrderStatusDto } from './dto/transition-order-status.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

const ORDER_NOT_FOUND_EXAMPLE = {
  statusCode: 404,
  error: ErrorCode.NOT_FOUND_ERROR,
  message: 'Order with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
};

@ApiTags('orders')
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
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(
    private readonly createOrder: CreateOrderUseCase,
    private readonly updateOrder: UpdateOrderUseCase,
    private readonly deleteOrder: DeleteOrderUseCase,
    private readonly getOrder: GetOrderUseCase,
    private readonly listOrders: ListOrdersUseCase,
    private readonly transitionOrderStatus: TransitionOrderStatusUseCase,
    private readonly addOrderItem: AddOrderItemUseCase,
    private readonly removeOrderItem: RemoveOrderItemUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список заказ-нарядов с фильтрами (мастеру видны только свои)' })
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
  async list(
    @Query() query: SearchOrdersDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<OrdersPageResponseDto> {
    const { page, limit, ...filters } = query;
    const result = await this.listOrders.execute(filters, { page, limit }, {
      role: request.user.role,
      staffPublicId: request.user.userId,
    });
    return OrdersPageResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ-наряд по ID' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Заказ не найден (либо не относится к текущему мастеру)',
    example: ORDER_NOT_FOUND_EXAMPLE,
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async get(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<OrderResponseDto> {
    const view = await this.getOrder.execute(id, {
      role: request.user.role,
      staffPublicId: request.user.userId,
    });
    return OrderResponseDto.fromView(view);
  }

  @Post()
  @ApiOperation({ summary: 'Создать заказ-наряд' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации (например, автомобиль не принадлежит клиенту)',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: 'The car does not belong to the specified client',
    },
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Клиент или автомобиль не найден',
    example: {
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'Client with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    const view = await this.createOrder.execute(dto);
    return OrderResponseDto.fromView(view);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить дату/комментарий или переназначить мастера' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Заказ или сотрудник не найден',
    example: ORDER_NOT_FOUND_EXAMPLE,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: 'Only staff with the MASTER role can be assigned to orders',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const view = await this.updateOrder.execute(id, dto);
    return OrderResponseDto.fromView(view);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить заказ-наряд (только в статусе «Принят»)' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Заказ не найден',
    example: ORDER_NOT_FOUND_EXAMPLE,
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Заказ не в статусе RECEIVED',
    example: {
      statusCode: 409,
      error: ErrorCode.CONFLICT_ERROR,
      message: 'Only orders in RECEIVED status can be deleted',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteOrder.execute(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Сменить статус заказа (ADMIN может менять статус вне очереди)' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Заказ не найден (либо не относится к текущему мастеру)',
    example: ORDER_NOT_FOUND_EXAMPLE,
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Недопустимый переход статуса',
    example: {
      statusCode: 409,
      error: ErrorCode.CONFLICT_ERROR,
      message: 'Cannot transition order from RECEIVED to PAID',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async transitionStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransitionOrderStatusDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.transitionOrderStatus.execute(id, dto.status, {
      role: request.user.role,
      staffPublicId: request.user.userId,
    });
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Добавить позицию в заказ (из прайс-листа или вручную)' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Заказ или услуга не найдена',
    example: ORDER_NOT_FOUND_EXAMPLE,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: 'Either serviceId or both name and priceKopecks are required',
    },
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'Заказ уже оплачен',
    example: {
      statusCode: 409,
      error: ErrorCode.CONFLICT_ERROR,
      message: 'Cannot modify items of a paid order',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddOrderItemDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<OrderItemResponseDto> {
    const item = await this.addOrderItem.execute(id, dto, {
      role: request.user.role,
      staffPublicId: request.user.userId,
    });
    return OrderItemResponseDto.fromDomain(item);
  }

  @Delete(':id/items/:itemId')
  @ApiOperation({ summary: 'Удалить позицию из заказа' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Заказ или позиция не найдена',
    example: ORDER_NOT_FOUND_EXAMPLE,
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(204)
  async removeItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ): Promise<void> {
    await this.removeOrderItem.execute(id, itemId);
  }
}

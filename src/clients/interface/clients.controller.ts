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
import { Roles } from '../../shared/interface/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../../shared/interface/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/interface/guards/roles.guard.js';
import { CreateClientUseCase } from '../application/use-cases/create-client.use-case.js';
import { DeleteClientUseCase } from '../application/use-cases/delete-client.use-case.js';
import { GetClientUseCase } from '../application/use-cases/get-client.use-case.js';
import { ListClientsUseCase } from '../application/use-cases/list-clients.use-case.js';
import { UpdateClientUseCase } from '../application/use-cases/update-client.use-case.js';
import { ClientResponseDto } from './dto/client.response.dto.js';
import { ClientsPageResponseDto } from './dto/clients-page.response.dto.js';
import { CreateClientDto } from './dto/create-client.dto.js';
import { SearchClientsDto } from './dto/search-clients.dto.js';
import { UpdateClientDto } from './dto/update-client.dto.js';

@ApiTags('clients')
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
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(
    private readonly createClient: CreateClientUseCase,
    private readonly updateClient: UpdateClientUseCase,
    private readonly deleteClient: DeleteClientUseCase,
    private readonly getClient: GetClientUseCase,
    private readonly listClients: ListClientsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список клиентов с поиском по ФИО и телефону' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Некорректные параметры пагинации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['limit must not be greater than 100'],
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async list(@Query() query: SearchClientsDto): Promise<ClientsPageResponseDto> {
    const { page, limit, ...filters } = query;
    const result = await this.listClients.execute(filters, { page, limit });
    return ClientsPageResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить клиента по ID' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Клиент не найден',
    example: {
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'Client with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<ClientResponseDto> {
    const client = await this.getClient.execute(id);
    return ClientResponseDto.fromDomain(client);
  }

  @Post()
  @ApiOperation({ summary: 'Создать клиента' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['firstName should not be empty', 'phone should not be empty'],
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Body() dto: CreateClientDto): Promise<ClientResponseDto> {
    const client = await this.createClient.execute(dto);
    return ClientResponseDto.fromDomain(client);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные клиента' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Клиент не найден',
    example: {
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'Client with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
    },
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['phone should not be empty'],
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.updateClient.execute(id, dto);
    return ClientResponseDto.fromDomain(client);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить клиента' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Клиент не найден',
    example: {
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'Client with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
    },
  })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: 'У клиента есть связанные записи (например, автомобили)',
    example: {
      statusCode: 409,
      error: ErrorCode.CONFLICT_ERROR,
      message: 'Client has associated records and cannot be deleted',
    },
  })
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteClient.execute(id);
  }
}

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
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '../../shared/domain/role.js';
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
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async list(@Query() query: SearchClientsDto): Promise<ClientsPageResponseDto> {
    const { page, limit, ...filters } = query;
    const result = await this.listClients.execute(filters, { page, limit });
    return ClientsPageResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить клиента по ID' })
  @Roles(Role.ADMIN, Role.MANAGER, Role.MASTER)
  async get(@Param('id', ParseIntPipe) id: number): Promise<ClientResponseDto> {
    const client = await this.getClient.execute(id);
    return ClientResponseDto.fromDomain(client);
  }

  @Post()
  @ApiOperation({ summary: 'Создать клиента' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Body() dto: CreateClientDto): Promise<ClientResponseDto> {
    const client = await this.createClient.execute(dto);
    return ClientResponseDto.fromDomain(client);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные клиента' })
  @Roles(Role.ADMIN, Role.MANAGER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClientDto,
  ): Promise<ClientResponseDto> {
    const client = await this.updateClient.execute(id, dto);
    return ClientResponseDto.fromDomain(client);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить клиента' })
  @Roles(Role.ADMIN, Role.MANAGER)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteClient.execute(id);
  }
}

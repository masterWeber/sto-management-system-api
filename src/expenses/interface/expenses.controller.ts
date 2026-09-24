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
import { CreateExpenseUseCase } from '../application/use-cases/create-expense.use-case.js';
import { DeleteExpenseUseCase } from '../application/use-cases/delete-expense.use-case.js';
import { GetExpenseUseCase } from '../application/use-cases/get-expense.use-case.js';
import { ListExpensesUseCase } from '../application/use-cases/list-expenses.use-case.js';
import { UpdateExpenseUseCase } from '../application/use-cases/update-expense.use-case.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { ExpenseResponseDto } from './dto/expense.response.dto.js';
import { ExpensesPageResponseDto } from './dto/expenses-page.response.dto.js';
import { SearchExpensesDto } from './dto/search-expenses.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';

const EXPENSE_NOT_FOUND_EXAMPLE = {
  statusCode: 404,
  error: ErrorCode.NOT_FOUND_ERROR,
  message: 'Expense with id 3fa85f64-5717-4562-b3fc-2c963f66afa6 not found',
};

@ApiTags('expenses')
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
@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class ExpensesController {
  constructor(
    private readonly createExpense: CreateExpenseUseCase,
    private readonly updateExpense: UpdateExpenseUseCase,
    private readonly deleteExpense: DeleteExpenseUseCase,
    private readonly getExpense: GetExpenseUseCase,
    private readonly listExpenses: ListExpensesUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Список расходов с фильтром по периоду и категории' })
  async list(@Query() query: SearchExpensesDto): Promise<ExpensesPageResponseDto> {
    const { page, limit, ...filters } = query;
    const result = await this.listExpenses.execute(filters, { page, limit });
    return ExpensesPageResponseDto.fromDomain(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить расход по ID' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Расход не найден',
    example: EXPENSE_NOT_FOUND_EXAMPLE,
  })
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<ExpenseResponseDto> {
    const expense = await this.getExpense.execute(id);
    return ExpenseResponseDto.fromDomain(expense);
  }

  @Post()
  @ApiOperation({ summary: 'Добавить расход' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['description should not be empty'],
    },
  })
  async create(@Body() dto: CreateExpenseDto): Promise<ExpenseResponseDto> {
    const expense = await this.createExpense.execute(dto);
    return ExpenseResponseDto.fromDomain(expense);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить расход' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Расход не найден',
    example: EXPENSE_NOT_FOUND_EXAMPLE,
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['description should not be empty'],
    },
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateExpenseDto,
  ): Promise<ExpenseResponseDto> {
    const expense = await this.updateExpense.execute(id, dto);
    return ExpenseResponseDto.fromDomain(expense);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить расход' })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Расход не найден',
    example: EXPENSE_NOT_FOUND_EXAMPLE,
  })
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteExpense.execute(id);
  }
}

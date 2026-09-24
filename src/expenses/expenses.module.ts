import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EXPENSE_REPOSITORY } from './domain/expense-repository.port.js';
import { ExpenseOrmEntity } from './infrastructure/persistence/expense.orm-entity.js';
import { TypeOrmExpenseRepository } from './infrastructure/typeorm-expense.repository.js';
import { CreateExpenseUseCase } from './application/use-cases/create-expense.use-case.js';
import { UpdateExpenseUseCase } from './application/use-cases/update-expense.use-case.js';
import { DeleteExpenseUseCase } from './application/use-cases/delete-expense.use-case.js';
import { GetExpenseUseCase } from './application/use-cases/get-expense.use-case.js';
import { ListExpensesUseCase } from './application/use-cases/list-expenses.use-case.js';
import { ExpensesController } from './interface/expenses.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseOrmEntity])],
  controllers: [ExpensesController],
  providers: [
    { provide: EXPENSE_REPOSITORY, useClass: TypeOrmExpenseRepository },
    CreateExpenseUseCase,
    UpdateExpenseUseCase,
    DeleteExpenseUseCase,
    GetExpenseUseCase,
    ListExpensesUseCase,
  ],
})
export class ExpensesModule {}

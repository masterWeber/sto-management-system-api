import { Type } from 'class-transformer';
import { IsDate, IsIn } from 'class-validator';
import { FINANCE_GROUP_BY_VALUES, type FinanceGroupBy } from '../../application/finance-summary.js';

export class FinanceSummaryQueryDto {
  @Type(() => Date)
  @IsDate()
  from!: Date;

  @Type(() => Date)
  @IsDate()
  to!: Date;

  @IsIn(FINANCE_GROUP_BY_VALUES)
  groupBy!: FinanceGroupBy;
}

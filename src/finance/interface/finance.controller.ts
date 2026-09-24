import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
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
import { FinanceQueryService } from '../application/finance-query.service.js';
import { GenerateFinanceReportPdfUseCase } from '../application/use-cases/generate-finance-report-pdf.use-case.js';
import { FinanceSummaryQueryDto } from './dto/finance-summary-query.dto.js';
import { FinanceSummaryResponseDto } from './dto/finance-summary.response.dto.js';

@ApiTags('finance')
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
@Controller('finance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class FinanceController {
  constructor(
    private readonly financeQueryService: FinanceQueryService,
    private readonly generateFinanceReportPdf: GenerateFinanceReportPdfUseCase,
  ) {}

  @Get('summary')
  @ApiOperation({ summary: 'Финансовая сводка за период: выручка, расходы, прибыль, график' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации параметров',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['groupBy must be one of the following values: day, week, month, quarter'],
    },
  })
  async summary(@Query() query: FinanceSummaryQueryDto): Promise<FinanceSummaryResponseDto> {
    const summary = await this.financeQueryService.getSummary(
      query.from,
      query.to,
      query.groupBy,
    );
    return FinanceSummaryResponseDto.fromDomain(summary);
  }

  @Get('report.pdf')
  @ApiOperation({ summary: 'Скачать финансовый отчёт за период в формате PDF' })
  @ApiProduces('application/pdf')
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Ошибка валидации параметров',
    example: {
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['groupBy must be one of the following values: day, week, month, quarter'],
    },
  })
  async reportPdf(
    @Query() query: FinanceSummaryQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    const pdf = await this.generateFinanceReportPdf.execute(query.from, query.to, query.groupBy);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="finance-report.pdf"');
    res.send(pdf);
  }
}

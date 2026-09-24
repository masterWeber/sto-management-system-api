import { Inject, Injectable } from '@nestjs/common';
import {
  PDF_GENERATOR,
  type PdfGenerator,
} from '../../../shared/application/ports/pdf-generator.port.js';
import { buildFinanceReportPdf } from '../../infrastructure/finance-report-pdf.renderer.js';
import { FinanceQueryService } from '../finance-query.service.js';
import type { FinanceGroupBy } from '../finance-summary.js';

@Injectable()
export class GenerateFinanceReportPdfUseCase {
  constructor(
    private readonly financeQueryService: FinanceQueryService,
    @Inject(PDF_GENERATOR) private readonly pdfGenerator: PdfGenerator,
  ) {}

  async execute(from: Date, to: Date, groupBy: FinanceGroupBy): Promise<Buffer> {
    const summary = await this.financeQueryService.getSummary(from, to, groupBy);
    return this.pdfGenerator.generate((doc) =>
      buildFinanceReportPdf(doc, { summary, from, to, groupBy }),
    );
  }
}

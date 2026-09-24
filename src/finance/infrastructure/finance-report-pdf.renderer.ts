import {
  CYRILLIC_FONT,
  CYRILLIC_FONT_BOLD,
} from '../../shared/infrastructure/pdfkit-generator.js';
import type { FinanceGroupBy, FinanceSummary } from '../application/finance-summary.js';

export interface FinanceReportPdfData {
  summary: FinanceSummary;
  from: Date;
  to: Date;
  groupBy: FinanceGroupBy;
}

const GROUP_BY_LABELS: Record<FinanceGroupBy, string> = {
  day: 'по дням',
  week: 'по неделям',
  month: 'по месяцам',
  quarter: 'по кварталам',
};

function formatMoney(kopecks: number): string {
  return `${(kopecks / 100).toFixed(2)} руб.`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU');
}

function drawMetricsRow(doc: PDFKit.PDFDocument, label: string, value: string): void {
  doc.font(CYRILLIC_FONT).text(label, doc.x, doc.y, { continued: true, width: 250 });
  doc.font(CYRILLIC_FONT_BOLD).text(value, { align: 'right' });
}

export function buildFinanceReportPdf(doc: PDFKit.PDFDocument, data: FinanceReportPdfData): void {
  const { summary } = data;

  doc.font(CYRILLIC_FONT_BOLD).fontSize(16).text('ФИНАНСОВЫЙ ОТЧЁТ', { align: 'center' });
  doc.moveDown();
  doc
    .font(CYRILLIC_FONT)
    .fontSize(11)
    .text(`Период: ${formatDate(data.from)} — ${formatDate(data.to)} (${GROUP_BY_LABELS[data.groupBy]})`);
  doc.moveDown();

  drawMetricsRow(doc, 'Выручка', formatMoney(summary.revenueKopecks));
  drawMetricsRow(doc, 'Расходы', formatMoney(summary.expensesKopecks));
  drawMetricsRow(doc, 'Чистая прибыль', formatMoney(summary.netProfitKopecks));
  drawMetricsRow(doc, 'Средний чек', formatMoney(summary.averageCheckKopecks));
  drawMetricsRow(doc, 'Количество клиентов', String(summary.clientsCount));
  drawMetricsRow(doc, 'Количество заказов', String(summary.ordersCount));
  doc.moveDown();

  doc.font(CYRILLIC_FONT_BOLD).fontSize(13).text('Динамика по периодам');
  doc.moveDown(0.5);
  doc.font(CYRILLIC_FONT_BOLD).fontSize(11);
  doc.text('Период', doc.x, doc.y, { continued: true, width: 150 });
  doc.text('Выручка', { continued: true, width: 150, align: 'right' });
  doc.text('Расходы', { align: 'right' });
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.3);

  doc.font(CYRILLIC_FONT);
  for (const point of summary.chart) {
    doc.text(formatDate(point.bucket), doc.x, doc.y, { continued: true, width: 150 });
    doc.text(formatMoney(point.revenueKopecks), { continued: true, width: 150, align: 'right' });
    doc.text(formatMoney(point.expensesKopecks), { align: 'right' });
  }
  if (summary.chart.length === 0) {
    doc.text('Нет данных за выбранный период.');
  }

  doc.moveDown();
  doc.font(CYRILLIC_FONT_BOLD).fontSize(13).text('Последние заказы');
  doc.moveDown(0.5);
  doc.font(CYRILLIC_FONT).fontSize(11);
  for (const order of summary.recentOrders) {
    doc.text(
      `${formatDate(order.scheduledAt)} — ${order.status} — ${formatMoney(order.totalKopecks)}`,
    );
  }
  if (summary.recentOrders.length === 0) {
    doc.text('Нет заказов за выбранный период.');
  }
}

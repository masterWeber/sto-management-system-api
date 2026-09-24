import {
  CYRILLIC_FONT,
  CYRILLIC_FONT_BOLD,
} from '../../shared/infrastructure/pdfkit-generator.js';
import type { Car } from '../../cars/domain/car.entity.js';
import type { Client } from '../../clients/domain/client.entity.js';
import type { Order } from '../domain/order.entity.js';

export interface OrderPdfData {
  order: Order;
  client: Client;
  car: Car;
}

function formatMoney(kopecks: number): string {
  return `${(kopecks / 100).toFixed(2)} руб.`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU');
}

function drawParties(doc: PDFKit.PDFDocument, data: OrderPdfData): void {
  doc.font(CYRILLIC_FONT).fontSize(11);
  doc.text(`Заказ-наряд №${data.order.id}`);
  doc.text(`Дата: ${formatDate(data.order.scheduledAt)}`);
  doc.moveDown();
  doc.text(`Клиент: ${data.client.firstName} ${data.client.lastName}`);
  doc.text(`Телефон: ${data.client.phone}`);
  doc.moveDown();
  doc.text(`Автомобиль: ${data.car.make}, ${data.car.year} г.`);
  doc.text(`Госномер: ${data.car.licensePlate}`);
  if (data.car.vin) doc.text(`VIN: ${data.car.vin}`);
  doc.moveDown();
}

function drawItemsTable(doc: PDFKit.PDFDocument, data: OrderPdfData): void {
  const nameWidth = 350;

  doc.font(CYRILLIC_FONT_BOLD);
  doc.text('Наименование работы', doc.x, doc.y, { continued: true, width: nameWidth });
  doc.text('Сумма', { align: 'right' });
  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.3);

  doc.font(CYRILLIC_FONT);
  for (const item of data.order.items) {
    doc.text(item.name, doc.x, doc.y, { continued: true, width: nameWidth });
    doc.text(formatMoney(item.price.toKopecks()), { align: 'right' });
  }

  doc.moveDown(0.3);
  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();
  doc.moveDown(0.3);

  doc.font(CYRILLIC_FONT_BOLD);
  doc.text('Итого', doc.x, doc.y, { continued: true, width: nameWidth });
  doc.text(formatMoney(data.order.total().toKopecks()), { align: 'right' });
}

export function buildActPdf(doc: PDFKit.PDFDocument, data: OrderPdfData): void {
  doc.font(CYRILLIC_FONT_BOLD).fontSize(16).text('АКТ ВЫПОЛНЕННЫХ РАБОТ', { align: 'center' });
  doc.moveDown();

  drawParties(doc, data);
  drawItemsTable(doc, data);

  doc.moveDown(2);
  doc.font(CYRILLIC_FONT).fontSize(11);
  doc.text('Работы выполнены полностью, в срок и с надлежащим качеством.');
  doc.text('Заказчик претензий по объёму, качеству и срокам оказания услуг не имеет.');
  doc.moveDown(2);
  doc.text('Исполнитель: _____________________');
  doc.moveDown();
  doc.text('Заказчик: _____________________');
}

export function buildContractPdf(doc: PDFKit.PDFDocument, data: OrderPdfData): void {
  doc.font(CYRILLIC_FONT_BOLD).fontSize(16).text('ДОГОВОР НА ОКАЗАНИЕ УСЛУГ', { align: 'center' });
  doc.moveDown();

  drawParties(doc, data);

  doc.font(CYRILLIC_FONT).fontSize(11);
  doc.text(
    '1. Исполнитель обязуется оказать услуги по ремонту и обслуживанию автомобиля Заказчика, ' +
      'указанного в настоящем договоре, а Заказчик обязуется принять и оплатить оказанные услуги.',
  );
  doc.moveDown();
  doc.text(
    '2. Перечень и стоимость работ определяются в соответствии с заказ-нарядом, являющимся ' +
      'неотъемлемой частью настоящего договора.',
  );
  doc.moveDown();
  drawItemsTable(doc, data);

  doc.moveDown(2);
  doc.text('Исполнитель: _____________________');
  doc.moveDown();
  doc.text('Заказчик: _____________________');
}

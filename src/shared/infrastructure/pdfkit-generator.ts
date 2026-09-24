import { Injectable } from '@nestjs/common';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import type { PdfGenerator } from '../application/ports/pdf-generator.port.js';

const assetsDir = join(dirname(fileURLToPath(import.meta.url)), 'assets');

export const CYRILLIC_FONT = 'PTSans';
export const CYRILLIC_FONT_BOLD = 'PTSans-Bold';

@Injectable()
export class PdfKitGenerator implements PdfGenerator {
  generate(draw: (doc: PDFKit.PDFDocument) => void): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      doc.registerFont(CYRILLIC_FONT, join(assetsDir, 'PTSans-Regular.ttf'));
      doc.registerFont(CYRILLIC_FONT_BOLD, join(assetsDir, 'PTSans-Bold.ttf'));
      doc.font(CYRILLIC_FONT);

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      draw(doc);
      doc.end();
    });
  }
}

export const PDF_GENERATOR = Symbol('PDF_GENERATOR');

export interface PdfGenerator {
  generate(draw: (doc: PDFKit.PDFDocument) => void): Promise<Buffer>;
}

import { Inject, Injectable } from '@nestjs/common';
import { CAR_REPOSITORY, type CarRepository } from '../../../cars/domain/car-repository.port.js';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../../clients/domain/client-repository.port.js';
import {
  PDF_GENERATOR,
  type PdfGenerator,
} from '../../../shared/application/ports/pdf-generator.port.js';
import { ConflictError, NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  STAFF_REPOSITORY,
  type StaffRepository,
} from '../../../staff/domain/staff-repository.port.js';
import { assertOrderVisibleTo } from '../assert-order-visible-to.js';
import { ORDER_REPOSITORY, type OrderRepository } from '../../domain/order-repository.port.js';
import {
  buildActPdf,
  buildContractPdf,
  type OrderPdfData,
} from '../../infrastructure/order-pdf.renderer.js';
import type { RequestingStaff } from '../requesting-staff.js';

export type OrderPdfDocumentType = 'act' | 'contract';

@Injectable()
export class GenerateOrderPdfUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
    @Inject(CAR_REPOSITORY) private readonly carRepository: CarRepository,
    @Inject(STAFF_REPOSITORY) private readonly staffRepository: StaffRepository,
    @Inject(PDF_GENERATOR) private readonly pdfGenerator: PdfGenerator,
  ) {}

  async execute(
    orderPublicId: string,
    documentType: OrderPdfDocumentType,
    requester: RequestingStaff,
  ): Promise<Buffer> {
    const order = await this.orderRepository.findByPublicId(orderPublicId);
    if (!order) throw new NotFoundError('Order', orderPublicId);
    await assertOrderVisibleTo(order, requester, this.staffRepository);

    if (!order.completedAt) {
      throw new ConflictError('The document is available once the order is completed');
    }

    const [client, car] = await Promise.all([
      this.clientRepository.findById(order.clientId),
      this.carRepository.findById(order.carId),
    ]);
    const data: OrderPdfData = { order, client: client!, car: car! };
    const render = documentType === 'act' ? buildActPdf : buildContractPdf;

    return this.pdfGenerator.generate((doc) => render(doc, data));
  }
}

import type { ServiceView } from '../../application/service-view.js';

export class ServiceResponseDto {
  id: string;
  name: string;
  priceKopecks: number;
  categoryId: string;

  private constructor(view: ServiceView) {
    this.id = view.service.publicId;
    this.name = view.service.name;
    this.priceKopecks = view.service.price.toKopecks();
    this.categoryId = view.categoryPublicId;
  }

  static fromView(view: ServiceView): ServiceResponseDto {
    return new ServiceResponseDto(view);
  }
}

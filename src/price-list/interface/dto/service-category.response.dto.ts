import type { ServiceCategory } from '../../domain/service-category.entity.js';

export class ServiceCategoryResponseDto {
  id: string;
  name: string;

  private constructor(category: ServiceCategory) {
    this.id = category.publicId;
    this.name = category.name;
  }

  static fromDomain(category: ServiceCategory): ServiceCategoryResponseDto {
    return new ServiceCategoryResponseDto(category);
  }
}

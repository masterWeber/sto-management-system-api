import type { Service } from '../domain/service.entity.js';

export interface ServiceView {
  service: Service;
  categoryPublicId: string;
}

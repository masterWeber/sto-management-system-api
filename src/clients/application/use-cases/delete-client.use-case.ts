import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../domain/client-repository.port.js';

@Injectable()
export class DeleteClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
  ) {}

  async execute(publicId: string): Promise<void> {
    const client = await this.clientRepository.findByPublicId(publicId);
    if (!client) throw new NotFoundError('Client', publicId);
    await this.clientRepository.delete(client.id!);
  }
}

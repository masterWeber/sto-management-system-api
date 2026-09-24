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

  async execute(id: number): Promise<void> {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new NotFoundError('Client', id);
    await this.clientRepository.delete(id);
  }
}

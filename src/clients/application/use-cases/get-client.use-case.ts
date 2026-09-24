import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../domain/client-repository.port.js';
import { Client } from '../../domain/client.entity.js';

@Injectable()
export class GetClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
  ) {}

  async execute(id: number): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new NotFoundError('Client', id);
    return client;
  }
}

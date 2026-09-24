import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '../../../shared/domain/errors/domain-error.js';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../domain/client-repository.port.js';
import { Client } from '../../domain/client.entity.js';

export interface UpdateClientInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

@Injectable()
export class UpdateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
  ) {}

  async execute(publicId: string, input: UpdateClientInput): Promise<Client> {
    const client = await this.clientRepository.findByPublicId(publicId);
    if (!client) throw new NotFoundError('Client', publicId);

    if (input.firstName !== undefined || input.lastName !== undefined) {
      client.rename(input.firstName ?? client.firstName, input.lastName ?? client.lastName);
    }
    if (input.phone !== undefined) {
      client.changePhone(input.phone);
    }
    return this.clientRepository.save(client);
  }
}

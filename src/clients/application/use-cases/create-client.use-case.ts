import { Inject, Injectable } from '@nestjs/common';
import {
  CLIENT_REPOSITORY,
  type ClientRepository,
} from '../../domain/client-repository.port.js';
import { Client } from '../../domain/client.entity.js';

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  phone: string;
}

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepository,
  ) {}

  async execute(input: CreateClientInput): Promise<Client> {
    const client = new Client(undefined, input.firstName, input.lastName, input.phone);
    return this.clientRepository.save(client);
  }
}

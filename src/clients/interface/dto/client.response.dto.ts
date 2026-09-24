import type { Client } from '../../domain/client.entity.js';

export class ClientResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;

  private constructor(client: Client) {
    this.id = client.id!;
    this.firstName = client.firstName;
    this.lastName = client.lastName;
    this.phone = client.phone;
  }

  static fromDomain(client: Client): ClientResponseDto {
    return new ClientResponseDto(client);
  }
}

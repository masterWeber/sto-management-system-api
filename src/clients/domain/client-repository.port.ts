import type { Client } from './client.entity.js';

export const CLIENT_REPOSITORY = Symbol('CLIENT_REPOSITORY');

export interface ClientSearchFilters {
  search?: string;
  phone?: string;
}

export interface ClientRepository {
  findById(id: number): Promise<Client | null>;
  findAll(filters: ClientSearchFilters): Promise<Client[]>;
  save(client: Client): Promise<Client>;
  delete(id: number): Promise<void>;
}

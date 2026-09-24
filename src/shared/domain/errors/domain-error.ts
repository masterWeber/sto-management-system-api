export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends DomainError {
  constructor(entity: string, id: number | string) {
    super(`${entity} with id ${id} not found`);
  }
}

export class ConflictError extends DomainError {}

export class ValidationError extends DomainError {}

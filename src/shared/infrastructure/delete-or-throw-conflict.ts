import { QueryFailedError } from 'typeorm';
import { ConflictError } from '../domain/errors/domain-error.js';

const POSTGRES_FOREIGN_KEY_VIOLATION = '23503';

export async function deleteOrThrowConflict(
  deleteFn: () => Promise<unknown>,
  conflictMessage: string,
): Promise<void> {
  try {
    await deleteFn();
  } catch (error) {
    if (
      error instanceof QueryFailedError &&
      (error.driverError as { code?: string }).code === POSTGRES_FOREIGN_KEY_VIOLATION
    ) {
      throw new ConflictError(conflictMessage);
    }
    throw error;
  }
}

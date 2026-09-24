import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import {
  ConflictError,
  DomainError,
  NotFoundError,
  ValidationError,
} from '../../domain/errors/domain-error.js';

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(error: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = DomainExceptionFilter.statusFor(error);
    response.status(status).json({
      statusCode: status,
      error: error.name,
      message: error.message,
    });
  }

  private static statusFor(error: DomainError): number {
    if (error instanceof NotFoundError) return 404;
    if (error instanceof ConflictError) return 409;
    if (error instanceof ValidationError) return 400;
    return 500;
  }
}

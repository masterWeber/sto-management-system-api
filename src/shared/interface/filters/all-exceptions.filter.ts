import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import type { Response } from 'express';
import {
  ConflictError,
  DomainError,
  NotFoundError,
  ValidationError,
} from '../../domain/errors/domain-error.js';
import { ErrorCode } from '../dto/error-response.dto.js';

interface NormalizedError {
  status: number;
  error: ErrorCode;
  message: string | string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, error, message } = AllExceptionsFilter.normalize(exception);
    if (status >= 500) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }
    response.status(status).json({ statusCode: status, error, message });
  }

  private static normalize(exception: unknown): NormalizedError {
    if (exception instanceof NotFoundError) {
      return { status: 404, error: ErrorCode.NOT_FOUND_ERROR, message: exception.message };
    }
    if (exception instanceof ConflictError) {
      return { status: 409, error: ErrorCode.CONFLICT_ERROR, message: exception.message };
    }
    if (exception instanceof ValidationError) {
      return { status: 400, error: ErrorCode.VALIDATION_ERROR, message: exception.message };
    }
    if (exception instanceof DomainError) {
      return { status: 500, error: ErrorCode.INTERNAL_SERVER_ERROR, message: exception.message };
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message =
        typeof body === 'string' ? body : ((body as { message?: string | string[] }).message ?? exception.message);
      return { status, error: AllExceptionsFilter.errorCodeForStatus(status), message };
    }
    return {
      status: 500,
      error: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  private static errorCodeForStatus(status: number): ErrorCode {
    switch (status) {
      case 400:
        return ErrorCode.BAD_REQUEST;
      case 401:
        return ErrorCode.UNAUTHORIZED;
      case 403:
        return ErrorCode.FORBIDDEN;
      case 404:
        return ErrorCode.NOT_FOUND_ERROR;
      case 409:
        return ErrorCode.CONFLICT_ERROR;
      case 429:
        return ErrorCode.THROTTLED;
      default:
        return status >= 500 ? ErrorCode.INTERNAL_SERVER_ERROR : ErrorCode.BAD_REQUEST;
    }
  }
}

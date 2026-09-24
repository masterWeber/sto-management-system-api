import { jest } from '@jest/globals';
import type { ArgumentsHost } from '@nestjs/common';
import { BadRequestException, ForbiddenException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import {
  ConflictError,
  DomainError,
  NotFoundError,
  ValidationError,
} from '../../domain/errors/domain-error.js';
import { ErrorCode } from '../dto/error-response.dto.js';
import { AllExceptionsFilter } from './all-exceptions.filter.js';

class UncategorizedDomainError extends DomainError {}

function createHost() {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({}),
      getNext: () => ({}),
    }),
  } as unknown as ArgumentsHost;
  return { host, status, json };
}

describe('AllExceptionsFilter', () => {
  const filter = new AllExceptionsFilter();

  it('maps NotFoundError to 404', () => {
    const { host, status, json } = createHost();
    filter.catch(new NotFoundError('Client', 'abc'), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'Client with id abc not found',
    });
  });

  it('maps ConflictError to 409', () => {
    const { host, status, json } = createHost();
    filter.catch(new ConflictError('Login taken'), host);

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      statusCode: 409,
      error: ErrorCode.CONFLICT_ERROR,
      message: 'Login taken',
    });
  });

  it('maps ValidationError to 400', () => {
    const { host, status, json } = createHost();
    filter.catch(new ValidationError('Invalid input'), host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Invalid input',
    });
  });

  it('falls back to 500 for an uncategorized DomainError subclass', () => {
    const { host, status, json } = createHost();
    filter.catch(new UncategorizedDomainError('Something odd'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      statusCode: 500,
      error: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Something odd',
    });
  });

  it('extracts the message from an HttpException with an object response body', () => {
    const { host, status, json } = createHost();
    filter.catch(new BadRequestException(['field is required']), host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      error: ErrorCode.BAD_REQUEST,
      message: ['field is required'],
    });
  });

  it('extracts the message from an HttpException with a string response body', () => {
    const { host, status, json } = createHost();
    filter.catch(new NotFoundException('Cannot GET /nope'), host);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      statusCode: 404,
      error: ErrorCode.NOT_FOUND_ERROR,
      message: 'Cannot GET /nope',
    });
  });

  it('maps a Forbidden HttpException to 403', () => {
    const { host, status, json } = createHost();
    filter.catch(new ForbiddenException(), host);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      statusCode: 403,
      error: ErrorCode.FORBIDDEN,
      message: 'Forbidden',
    });
  });

  it('falls back to BAD_REQUEST for an unmapped 4xx HttpException status', () => {
    const { host, status, json } = createHost();
    filter.catch(new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS), host);

    expect(status).toHaveBeenCalledWith(429);
    expect(json).toHaveBeenCalledWith({
      statusCode: 429,
      error: ErrorCode.BAD_REQUEST,
      message: 'Too many requests',
    });
  });

  it('falls back to INTERNAL_SERVER_ERROR for an unmapped 5xx HttpException status', () => {
    const { host, status, json } = createHost();
    filter.catch(new HttpException('Service unavailable', HttpStatus.SERVICE_UNAVAILABLE), host);

    expect(status).toHaveBeenCalledWith(503);
    expect(json).toHaveBeenCalledWith({
      statusCode: 503,
      error: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Service unavailable',
    });
  });

  it('hides internal details for a completely unknown thrown value', () => {
    const { host, status, json } = createHost();
    filter.catch(new TypeError('unexpected internal bug'), host);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      statusCode: 500,
      error: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  });
});

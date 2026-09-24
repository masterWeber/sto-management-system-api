import { ApiProperty } from '@nestjs/swagger';

export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  THROTTLED = 'THROTTLED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export class ErrorResponseDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty({ enum: ErrorCode })
  error: ErrorCode;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  message: string | string[];
}

export const UNAUTHORIZED_EXAMPLE = {
  statusCode: 401,
  error: ErrorCode.UNAUTHORIZED,
  message: 'Unauthorized',
};

export const FORBIDDEN_EXAMPLE = {
  statusCode: 403,
  error: ErrorCode.FORBIDDEN,
  message: 'Forbidden resource',
};

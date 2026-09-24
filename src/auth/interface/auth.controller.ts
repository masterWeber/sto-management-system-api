import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorCode, ErrorResponseDto } from '../../shared/interface/dto/error-response.dto.js';
import { LoginUseCase } from '../application/use-cases/login.use-case.js';
import { LoginDto } from './dto/login.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly login: LoginUseCase) {}

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Вход по логину и паролю, выдаёт JWT' })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Неверный логин или пароль',
    example: {
      statusCode: 400,
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Invalid login or password',
    },
  })
  @HttpCode(200)
  async logIn(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    const accessToken = await this.login.execute(dto);
    return { accessToken };
  }
}

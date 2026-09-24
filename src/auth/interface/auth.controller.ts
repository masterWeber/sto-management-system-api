import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUseCase } from '../application/use-cases/login.use-case.js';
import { LoginDto } from './dto/login.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly login: LoginUseCase) {}

  @Post('login')
  @ApiOperation({ summary: 'Вход по логину и паролю, выдаёт JWT' })
  @HttpCode(200)
  async logIn(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    const accessToken = await this.login.execute(dto);
    return { accessToken };
  }
}

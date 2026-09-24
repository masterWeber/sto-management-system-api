import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StaffModule } from '../staff/staff.module.js';
import { LoginUseCase } from './application/use-cases/login.use-case.js';
import { AUTH_TOKEN_SERVICE } from './application/ports/auth-token.port.js';
import { JwtAuthTokenService } from './infrastructure/jwt-auth-token.service.js';
import { JwtStrategy } from './infrastructure/jwt.strategy.js';
import { AuthController } from './interface/auth.controller.js';

@Module({
  imports: [
    StaffModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtStrategy,
    { provide: AUTH_TOKEN_SERVICE, useClass: JwtAuthTokenService },
  ],
})
export class AuthModule {}

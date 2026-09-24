import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port.js';
import { ScryptPasswordHasher } from './infrastructure/scrypt-password-hasher.js';
import { AllExceptionsFilter } from './interface/filters/all-exceptions.filter.js';

@Global()
@Module({
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: PASSWORD_HASHER, useClass: ScryptPasswordHasher },
  ],
  exports: [PASSWORD_HASHER],
})
export class SharedModule {}

import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port.js';
import { ScryptPasswordHasher } from './infrastructure/scrypt-password-hasher.js';
import { DomainExceptionFilter } from './interface/filters/domain-exception.filter.js';

@Global()
@Module({
  providers: [
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
    { provide: PASSWORD_HASHER, useClass: ScryptPasswordHasher },
  ],
  exports: [PASSWORD_HASHER],
})
export class SharedModule {}

import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DOMAIN_EVENT_PUBLISHER } from './application/ports/domain-event-publisher.port.js';
import { PASSWORD_HASHER } from './application/ports/password-hasher.port.js';
import { PDF_GENERATOR } from './application/ports/pdf-generator.port.js';
import { NodeEventEmitterPublisher } from './infrastructure/node-event-emitter-publisher.js';
import { PdfKitGenerator } from './infrastructure/pdfkit-generator.js';
import { ScryptPasswordHasher } from './infrastructure/scrypt-password-hasher.js';
import { AllExceptionsFilter } from './interface/filters/all-exceptions.filter.js';

@Global()
@Module({
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: PASSWORD_HASHER, useClass: ScryptPasswordHasher },
    { provide: DOMAIN_EVENT_PUBLISHER, useClass: NodeEventEmitterPublisher },
    { provide: PDF_GENERATOR, useClass: PdfKitGenerator },
  ],
  exports: [PASSWORD_HASHER, DOMAIN_EVENT_PUBLISHER, PDF_GENERATOR],
})
export class SharedModule {}

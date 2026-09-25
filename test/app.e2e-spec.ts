import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { dataSourceOptions } from '../src/data-source.js';
import { HealthController } from '../src/health.controller.js';

// Boots a slim module (DB + health check) instead of the full AppModule:
// @nestjs/throttler's CJS build require()-ing pure-ESM @nestjs/common forms
// a require(esm) cycle that only Jest's module loader (not real Node) treats
// as fatal — real Node/the running app is unaffected. Upgrade path: drop
// this workaround once @nestjs/throttler ships an ESM build or Jest's
// require(esm) cycle handling matches Node's.
describe('Health (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true, synchronize: false }),
      ],
      controllers: [HealthController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});

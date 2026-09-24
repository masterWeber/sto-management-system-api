import 'reflect-metadata';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataSource, type DataSourceOptions } from 'typeorm';

const currentDir = dirname(fileURLToPath(import.meta.url));

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'sto_management_system',
  entities: [join(currentDir, '**/*.orm-entity.js')],
  migrations: [join(currentDir, 'migrations/*.js')],
};

export default new DataSource(dataSourceOptions);

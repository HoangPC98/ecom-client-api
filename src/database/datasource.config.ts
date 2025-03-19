import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
dotenv.config();

export const customerDatabaseConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // entities: ['src/database/entities/user-entity/*{.ts,.js}'],
  entities: ['dist/entities/user-entity/*.entity.js'],
  synchronize: false,
  logging: process.env.DATABASE_LOGGING ? true : false,
  // migrationsRun: true,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
};

export default new DataSource({
  ...customerDatabaseConfig,
});

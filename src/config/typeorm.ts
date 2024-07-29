import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const config = (): DataSourceOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['dist/modules/**/*.entity.{js,ts}'],
  migrations: ['dist/migrations/*.{js,ts}'],
  database: 'postgres',
  synchronize: true,
});

export default registerAs('typeorm', () => config());
export const connectionSource = new DataSource(config());

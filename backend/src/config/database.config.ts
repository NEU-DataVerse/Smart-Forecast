import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    // synchronize: auto-create tables
    // - development: always sync
    // - production: only sync if DB_SYNC=true (first run)
    synchronize:
      process.env.NODE_ENV === 'development' || process.env.DB_SYNC === 'true',
    logging: process.env.NODE_ENV === 'development',
  };
});

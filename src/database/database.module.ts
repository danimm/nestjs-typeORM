import { Module, Global } from '@nestjs/common';
import { Client } from 'pg';

const client = new Client({
  user: 'root',
  host: 'localhost',
  database: 'my_db',
  password: '1200',
  port: 5432,
});

client.connect();

@Global()
@Module({
  providers: [
    {
      provide: 'PG',
      useValue: client,
    },
  ],
  exports: ['PG'],
})
export class DatabaseModule {}

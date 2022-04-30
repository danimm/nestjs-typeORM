import { Module, Global } from '@nestjs/common';
import { Client } from 'pg';
import config from '../config';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { username, host, database, password, port } =
          configService.postgres;
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const { username, host, database, password, port } =
          configService.postgres;
        const client = new Client({
          user: username,
          host,
          database,
          password,
          port,
        });
        client.connect();
        return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: ['PG', TypeOrmModule],
})
export class DatabaseModule {}

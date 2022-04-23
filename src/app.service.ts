import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg';
import config from './config';

@Injectable()
export class AppService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @Inject('PG') private client: Client,
  ) {}

  getHello(): string {
    const apiKey = this.configService.apiKey;
    const dbName = this.configService.database.name;
    return `Hello!: ${apiKey}, ${dbName}`;
  }

  getTasks(): Promise<{ id: number; title: string; completed: boolean }[]> {
    return new Promise((resolve, reject) => {
      this.client.query('SELECT * FROM tasks', (err, res) => {
        if (err) reject(err);
        else resolve(res.rows);
      });
    });
  }
}

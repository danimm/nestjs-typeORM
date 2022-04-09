import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {
  }

  getHello(): string {
    const apiKey = this.config.get<string>('API_KEY');
    const dbName = this.config.get<string>('DATABASE_NAME');
    const env = process.env.NODE_ENV;
    return `Hello from ${ env }: ${ apiKey }, ${ dbName }`;
  }
};
